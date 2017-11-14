import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import {ICustomerAgreementsState} from "../../domain/state";
import {CustomerAgreementsActions} from "../../domain/actions";
import {customerAgreementsQueries} from "../../domain/queries";
import { OverlayLoaderSize } from "eing-ui-library";

@Component({
  selector: "eing-customer-agreements-base-component",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class CustomerAgreementsBaseComponent implements OnInit {

    public overlayLoaderSize : string = OverlayLoaderSize.PARTIAL;
    public isLoading$ : Observable<boolean>;

  constructor(private store : Store<ICustomerAgreementsState>,
          private customerAgreementsActions : CustomerAgreementsActions) {}
  
  public ngOnInit(abc : string, b:string){
      this.isLoading$ = this.store.select(customerAgreementsQueries.isLoading);
  }
  
  public loadData(){
      this.store.dispatch(this.customerAgreementsActions.loadAction());
  }

}

