import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { CreateDeviceDto } from './createdevice.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App'
    }
  }

  @Get('newdevice')
  @Render('newdeviceform')
  getNewDeviceForm() {}

  @Post('newdevice')
  @Render('newdeviceform')
  postNewDevice(@Body() body: CreateDeviceDto) {
    // Több validációs üzenetet szeretnénk megjeleníteni egysezrre:
    // string-ekből álló listában tároljuk
    const errors: string[] = [];

    if (!body.price) {
      // Meg van-e adva
      errors.push('Price is required');
    } else {
      const priceNum = Number(body.price);
      if (isNaN(priceNum)) {
        // Valóban szám-e
        errors.push('Price must be a valid number');
      } else if (priceNum <= 0) {
        // Pozitív-e
        errors.push('Price must be positive');
      }
    }

    if (!body.type) {
      errors.push('Type is required');
    } else if (body.type !== 'router' &&
      body.type !== 'switch' &&
      body.type !== 'firewall') {
      // A három érvényes érték egyikét veszi-e fel
      errors.push('Type must be one of the required values');
    }

    if (!body.serial) {
      errors.push('Serial is requried');
    } else if (! /^[A-Z]{4}-[0-9]{4}$/.test(body.serial)) {
      // Megfelel-e a "4 nagybetű - kötőjel - 4 szám" mintának
      errors.push('Serial must be in the format ABCD-1234');
    }

    if (errors.length > 0) {
      // Ha van min. 1 validációs hibánk, akkor sikertelen
      return {
        errors, // Adjuk vissza a hibaüzeneteket
        body    // és az űrlap jelenlegi adatait
      }
    } else {
      // Ha nincs hiba, akkor minden OK
      // TODO: Eltároljuk a kapott adatokat fájlba, db-be
      return {
        success: true // Jelezzük az űrlapnak, hogy sikeres mentés
      }
    }
  }
}
