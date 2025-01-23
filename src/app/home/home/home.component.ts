import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  showOptions = false;
  messageForm!: FormGroup;
  messages: { text: string; type: 'incoming' | 'outgoing'; complete: boolean; isImage?: boolean }[] = [];

  constructor(private fb: FormBuilder, private homeService: HomeService, public authService: AuthService) { }

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });

    this.homeService.fetchMessageHistory().then((data) => {
      data.data.forEach((msg: any) => {
        this.messages.push({
          text: msg.imgLink != null ? msg.imgLink : msg.arys ? msg.arys : msg.user,
          type: msg.arys ? 'incoming' : 'outgoing',
          complete: true,
          isImage: msg.imgLink != null
        });
      })

      setTimeout(() => this.scrollToBottom(), 1000);
    });



    // Suscribirse al stream de mensajes
    this.homeService.messageStream.subscribe((fragment) => {
      const lastIncomingMessage = this.messages.find(
        (msg) => msg.type === 'incoming' && !msg.isImage && !msg.complete
      );

      if (lastIncomingMessage) {
        lastIncomingMessage.text += fragment;
        navigator.vibrate(50);
      } else {
        this.messages.push({ text: fragment, type: 'incoming', isImage: false, complete: false });
      }

      this.scrollToBottom();
    });
  }

  async sendMessage(): Promise<void> {
    if (this.messageForm.invalid) return;

    const userMessage = this.messageForm.value.message;
    this.messages.push({ text: userMessage, type: 'outgoing', isImage: false, complete: true });
    this.messageForm.reset();
    setTimeout(() => this.scrollToBottom(), 100);

    // Verificar si se debe generar una imagen
    const shouldGenerateImage = this.isImageRequest(userMessage);

    if (shouldGenerateImage) {
      this.homeService.fetchImageFromServer(userMessage).then((imageUrl) => {
        this.messages.push({ text: imageUrl, type: 'incoming', isImage: true, complete: true });
        this.scrollToBottom();
      });
    } else {
      // Añadir un marcador para el mensaje en proceso
      this.messages.push({ text: '', type: 'incoming', complete: false });

      await this.homeService.fetchMessagesFromServer(userMessage);

      // Marcar el mensaje como completo
      const lastIncomingMessage = this.messages.find(
        (msg) => msg.type === 'incoming' && !msg.complete
      );
      if (lastIncomingMessage) {
        lastIncomingMessage.complete = true;
      }
    }
  }

  private isImageRequest(message: string): boolean {
    const imageKeywords = ['imagen', 'foto', 'fotografía', 'dibujar', 'crear imagen', 'crea una imagen'];
    const hasImageIntent = /crear|crea|generar|hacer|dibujar|producir/i.test(message.toLowerCase());
    return imageKeywords.some((keyword) => message.toLowerCase().includes(keyword)) && hasImageIntent;
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTo({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth', // Desplazamiento animado
      });
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}
