import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Router, ActivatedRoute } from '@angular/router';

// Bluetooth UUIDs
const BT_SERVICE = 'ffe0';
const BT_CHARACTERISTIC = 'ffe1';
//const DIMMER_CHARACTERISTIC = 'ff12';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  peripheral: any = {};
  
  
  statusMessage: string;
  devices:any[] =[];
  releA: boolean = false;
  releB: boolean = false;
  
  
  public dataFromDevice: any;

  constructor(private router: ActivatedRoute,private ngZone: NgZone, private ble: BLE, public navCtrl: NavController,
                private alertCtrl: AlertController) {

                    this.peripheral={};

                    this.router.queryParams.subscribe(params=>{
                      if(params && params.special){
                        const device = JSON.parse(params.special);
                        this.setStatus('Conectando a ' + device.name || device.id);
                        //conectar
                        this.BleConnect(device);
                        // this.ble.connect(device).subscribe(
                        //   peripheral=> this.onConnected(peripheral),
                        //   peripheral=>this.showAlert('Error de conexión','Se ha producido un error, intente de nuevo')
                        //   );
                      }
                    });
                  
                             
                  
//constructor
   }

  ngOnInit() {
    console.log("onInitDetail");
  }

  BleConnect(device) {
    this.ble.connect(device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => console.log(peripheral)
    );
}


   
   changedA(event){
    //console.log(event.detail.checked);
    if(event.detail.checked == true){
      var hex = 'C5 04 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 1 no a estado cerrado
      var typedArray1A = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
       return parseInt(h, 16)
     }))
     console.log(typedArray1A)
      
      
    this.ble.writeWithoutResponse(this.peripheral.id, BT_SERVICE, BT_CHARACTERISTIC, typedArray1A.buffer).then(
      () => this.setStatus('Relé A activado'),e => this.showAlert('error ',e)
      
    );
    }else{
      var hex = 'C5 06 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 1 no a estado abierto
      var typedArray2A = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
       return parseInt(h, 16)
     }))
     console.log(typedArray2A)
      
            this.ble.writeWithoutResponse(this.peripheral.id, BT_SERVICE, BT_CHARACTERISTIC, typedArray2A.buffer).then(
        () => this.setStatus('Relé A desactivado'),e => this.showAlert('error ',e)
      );
    
    }
  }
  //changedA

  changedB(event){
    //console.log(event.detail.checked);
    if(event.detail.checked == true){
      //console.log("enviar hex para posicion 1B");
     var hex = 'C5 05 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 2 no a estado cerrado
     //convertir hexadecimales a un arrayBuffer para lograr el envío
     var typedArray1B = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(
       function (h) {
      return parseInt(h, 16)
    }
    ))
    console.log(typedArray1B)
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
      this.ble.writeWithoutResponse(this.peripheral.id,BT_SERVICE,BT_CHARACTERISTIC,typedArray1B.buffer).then(
        () => this.setStatus('Relé B activado'),e => this.showAlert('error ',e)
      );  
      
    }else{
      //console.log("enviar hex para posicion 2B");
      var hex = 'C5 07 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 2 no a estado abierto
     var typedArray2B = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    console.log(typedArray2B)
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
      this.ble.writeWithoutResponse(this.peripheral.id,BT_SERVICE,BT_CHARACTERISTIC,typedArray2B.buffer).then(
        () => this.setStatus('Relé B desactivado'),e => this.showAlert('error ',e)
      );
    }
  }//changedB


    bleDisconnect(){
      this.ble.disconnect(this.peripheral.id);
      this.ble.refreshDeviceCache(this.peripheral.id,10000)
    }  

  onConnected(peripheral) {

    
    this.peripheral = peripheral;
     this.setStatus('Conectado a ' + (peripheral.name || peripheral.id));
    //this.setStatus('Conectado a ' + (peripheral.name));
    //obtener estado de los reles?
    // this.ble.read(this.peripheral.id,BT_SERVICE,BT_CHARACTERISTIC).then(
    //   buffer => {
    //     let data = new Uint8Array(buffer);
    //     this.setStatus('caracteristica obtenida:'+data[0]);
    //     this.ngZone.run( ()=> {
    //       //this.releA = data[0];
    //     } )
        
    //   }
    // )


  }//onConnected

   setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

   ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

   async showAlert(title, message) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  push1A(event){
    console.log("ha presionado 1A");
    var hex = 'C5 04 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 1 no a estado cerrado
      var typedArray1A = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
       return parseInt(h, 16)
     }))
     console.log(typedArray1A)
      
      
    this.ble.writeWithoutResponse(this.peripheral.id, BT_SERVICE, BT_CHARACTERISTIC, typedArray1A.buffer).then(
      () => this.setStatus('Relé A activado'),e => this.showAlert('error ',e)
      
    );
  }

  push2A(event){
    console.log("ha presionado 2A");
    var hex = 'C5 06 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 1 no a estado abierto
      var typedArray2A = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
       return parseInt(h, 16)
     }))
     console.log(typedArray2A)
      
            this.ble.writeWithoutResponse(this.peripheral.id, BT_SERVICE, BT_CHARACTERISTIC, typedArray2A.buffer).then(
        () => this.setStatus('Relé A desactivado'),e => this.showAlert('error ',e)
      );
  }

  push1B(event){
    console.log("ha presionado 1B");
    var hex = 'C5 05 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 2 no a estado cerrado
     //convertir hexadecimales a un arrayBuffer para lograr el envío
     var typedArray1B = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(
       function (h) {
      return parseInt(h, 16)
    }
    ))
    console.log(typedArray1B)
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
      this.ble.writeWithoutResponse(this.peripheral.id,BT_SERVICE,BT_CHARACTERISTIC,typedArray1B.buffer).then(
        () => this.setStatus('Relé B activado'),e => this.showAlert('error ',e)
      ); 
  }

  push2B(event){
    console.log("ha presionado 2B");
    var hex = 'C5 07 31 32 33 34 35 36 37 38 AA';//codigo hexadecimal para cambiar canal 2 no a estado abierto
     var typedArray2B = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    console.log(typedArray2B)
    //console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
      this.ble.writeWithoutResponse(this.peripheral.id,BT_SERVICE,BT_CHARACTERISTIC,typedArray2B.buffer).then(
        () => this.setStatus('Relé B desactivado'),e => this.showAlert('error ',e)
      );
  }

}
