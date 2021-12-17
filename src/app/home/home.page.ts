import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams, AlertController } from '@ionic/angular'; 
import { Router, ActivatedRoute,NavigationExtras  } from '@angular/router';

//BT UUIDs
const BT_SERVICE = 'ffe0';
const SWITCH_CHARACTERISTIC = 'ffe1';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  devices:any[] =[];
  
  statusMessage: string ="Powered by C&D Technología";
  brillo: number;
  //variables control
  scanInfo: any;
  dev: any;
  peripheral: any ={};
  releA: boolean = false;
  releB: boolean = false;
  hide: boolean = true;
  

  constructor(private router: Router,public navCtrl: NavController ,private ble: BLE , private ngZone: NgZone, 
    private alertCtrl: AlertController) {
      this.peripheral = {};
    }

    // stringToByte(data){
    //   var array = new Uint8Array(data.length);
    //   for(var i =0 ,l = data.length; i<l; i++){
    //   array[i] = data.charCodeAt(i);
    //   }
    //   return array.buffer;
    //   }

  

  Scan(){
    this.devices = [];
    this.ble.isEnabled().then(resp=>{
      console.log("Activado");
    },error=>{this.showAlert("Bluetooth desactivado","Por favor activar bluetooth del teléfono")}
    );
    this.ble.scan([],10).subscribe(
      device => this.onDeviceDiscovered(device)
    );

  }//end Scan

  onDeviceDiscovered(device){
    console.log('Descubierto' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device)
      console.log(device);
    })
  }

 

  

    // connect(id){

    //   let deviceID = id;
    //   this.setStatus('Conectando a '+ deviceID);


    //   this.ble.connect(id).subscribe(
    //     success => this.onConnected(success),
    //      success => this.showAlert('Desconectado','Se ha desconectado.')
    //   )
    // }



  // onConnected(peripheral) {

    
  //   this.peripheral = peripheral;
  //   // this.setStatus('Conectado a ' + (peripheral.name || peripheral.id));
  //   this.setStatus('Conectado a ' + (peripheral.name));
    


  // }//onConnected

  // changedA(event){
  //   //console.log(event.detail.checked);
  //   if(event.detail.checked == true){
  //     var hex0 = Number(197).toString(16);
  //     var hex1 = Number(4).toString(16);
  //     var hex2 = Number(1).toString(16);
  //     var hex3 = Number(2).toString(16);
  //     var hex4 = Number(3).toString(16);
  //     var hex5 = Number(4).toString(16);
  //     var hex6 = Number(5).toString(16);
  //     var hex7 = Number(6).toString(16);
  //     var hex8 = Number(7).toString(16);
  //     var hex9 = Number(8).toString(16);
  //     var hex10 = Number(170).toString(16);
  //     console.log("enviar hex para posicion 1A ");
      
  //     //let buffer = new Uint8Array([1]).buffer;
  //     var newdata = [hex0,hex1,hex2,hex3,hex4,hex5,hex6,hex7,hex8,hex9,hex10];
  //     var data = new Uint8Array(11);
  //     data[0]=parseInt(hex0,16);
  //     data[1]=parseInt(hex1,16);
  //     data[2]=parseInt(hex2,16);
  //     data[3]=parseInt(hex3,16);
  //     data[4]=parseInt(hex4,16);
  //     data[5]=parseInt(hex5,16);
  //     data[6]=parseInt(hex6,16);
  //     data[7]=parseInt(hex7,16);
  //     data[8]=parseInt(hex8,16);
  //     data[9]=parseInt(hex9,16);
  //     data[10]=parseInt(hex10,16);
  //     console.log(newdata);
  //     console.log(data);
  //   this.ble.write(this.peripheral.id, BT_SERVICE, SWITCH_CHARACTERISTIC, data).then(
  //     () => this.setStatus(newdata),e => this.showAlert('error ',e)
      
  //   );
  //   }else{
  //     // console.log("enviar hex para posicion 2A");
  //     // let buffer = new Uint8Array([0]).buffer;
  //     var hex0 = Number(197).toString(16);
  //     var hex1 = Number(6).toString(16);
  //     var hex2 = Number(1).toString(16);
  //     var hex3 = Number(2).toString(16);
  //     var hex4 = Number(3).toString(16);
  //     var hex5 = Number(4).toString(16);
  //     var hex6 = Number(5).toString(16);
  //     var hex7 = Number(6).toString(16);
  //     var hex8 = Number(7).toString(16);
  //     var hex9 = Number(8).toString(16);
  //     var hex10 = Number(170).toString(16);
  //     console.log("enviar hex para posicion 1B ");
      
  //     //let buffer = new Uint8Array([1]).buffer;
  //     var newdata2 = [hex0,hex1,hex2,hex3,hex4,hex5,hex6,hex7,hex8,hex9,hex10];
  //     var data2 = new Uint8Array(11);
  //     data2[0]=parseInt(hex0,16);
  //     data2[1]=parseInt(hex1,16);
  //     data2[2]=parseInt(hex2,16);
  //     data2[3]=parseInt(hex3,16);
  //     data2[4]=parseInt(hex4,16);
  //     data2[5]=parseInt(hex5,16);
  //     data2[6]=parseInt(hex6,16);
  //     data2[7]=parseInt(hex7,16);
  //     data2[8]=parseInt(hex8,16);
  //     data2[9]=parseInt(hex9,16);
  //     data2[10]=parseInt(hex10,16);
  //     console.log(newdata2);
  //     console.log(data2);
  //     this.ble.write(this.peripheral.id, BT_SERVICE, SWITCH_CHARACTERISTIC, data2).then(
  //       () => this.setStatus(newdata2),e => this.showAlert('error ',e)
  //     );
    
  //   }
  // }//changed

  // changedB(event){
  //   //console.log(event.detail.checked);
  //   if(event.detail.checked == true){
  //     console.log("enviar hex para posicion 1B");
  //     //aqui mandar e
  //     // this.ble.write()
  //   }else{
  //     console.log("enviar hex para posicion 2B");
  //   }
  // }//changed

  

  async showAlert(title, message) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: message,
      buttons: ['OK']
    });
    await alert.present();
  }


    // Disconnect peripheral when leaving the page
  // ionViewWillLeave() {
  //   console.log('ionViewWillLeave disconnecting Bluetooth');
  //   this.ble.disconnect(this.peripheral.id).then(
  //     () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
  //     () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
  //   )
  // }

    setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
        
    console.log(JSON.stringify(device) + ' selected');
      let navigationExtras: NavigationExtras = {
          queryParams: {
              special: JSON.stringify(device)
          }
      };
      this.router.navigate(['detail'], navigationExtras);
  }


}
