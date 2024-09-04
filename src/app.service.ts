import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AppService {
  getHello(): string {
    var secret = speakeasy.generateSecret({ name: 'appointment manager' });
    console.log(secret);
    // Get the data URL of the authenticator URL
    QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
      console.log(data_url);
    });
    return 'Hello World!';
  }
}
