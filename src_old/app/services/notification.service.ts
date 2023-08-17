import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message){
    // this.toastr.success(message)
    this.toastr.success(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
  }

  showSuccesslogin(message){
    // this.toastr.success(message)
    this.toastr.success(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
  }
  
  showSuccessForTransaction(message){
    // this.toastr.success(message)
    this.toastr.success(message, 'Payment done successfully', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
  }

  showError(message){
    this.toastr.error(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });

    // this.toastr.error(message)
  }
  
  showInfo(message){
    this.toastr.info(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });

    // this.toastr.info(message)
  }
  
  showWarning(message){
    this.toastr.warning(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
    // this.toastr.warning(message)
  }
    showWarninglogout(message){
    this.toastr.warning(message, '', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
    // this.toastr.warning(message)
  }
  
}
