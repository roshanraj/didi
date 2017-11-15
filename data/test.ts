import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { CustomerAgreementsModels } from "../../domain/models";
import { CustomerAgreementsActions } from "../../domain/actions";
import {
    ICustomerAgreementsState,
    initialContractShareArticlePopupState
} from "../../domain/state";
import { customerAgreementsQueries } from "../../domain/queries";
import { AppUtil, FormMaskConstants } from "eing-core";

import { AccountEntityModels, accountEntityQueries } from "eing-account-entity";
import {
    customerEntityQueries,
    CustomerEntityModels,
    CustomerEntityActions
} from "eing-customer-entity";

import * as CUSTOMER_AGREEMENT_CONSTANTS from "../../constants/customer-agreements.constants";
import { ShareArticlePopupService } from "./share-article-popup.service";
@Component({
    templateUrl: "./share-article-popup.component.html",
    styleUrls: ["./share-article-popup.component.scss"]
})
export class ShareArticlePopupComponent implements OnInit {
    constructor(
        private customerAgreementsStore: Store<ICustomerAgreementsState>,
        private customerAgreementsActions: CustomerAgreementsActions,
        private shareArticlePopupService: ShareArticlePopupService
    ) {}

    /** Popup labels */
    private shareArticleViaEmailLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.SHARE_ARTICLE_VIA_EMAIL;
    private preferredLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.PREFERRED_LABEL;
    private makePreferredLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.MAKE_PREFRRED_LABEL;
    private otherEmailAddressLebel: string = CUSTOMER_AGREEMENT_CONSTANTS.OTHER_EMAIL_ADDRESS;
    private emailWillNotSaveLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.EMAIL_WILL_NOT_SAVE_MESSAGE;
    private shareArticleViaTextLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.SHARE_ARTICLE_VIA_TEXT_MESSAGE;
    private mobileNumberLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.MOBILE_NUBMER_LABEL;
    private otherMobileNumberLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.OTHER_MOBILE_NUMBER_LABEL;
    private phoneWillNotSaveLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.MOBILE_NUMBER_WILL_NOT_SAVE_MESSAGE;
    private submitButtonLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.SUBMIT_BUTTON;
    private cancelButtonLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.CANCEL_BUTTON;
    private registerButtonLabel: string = CUSTOMER_AGREEMENT_CONSTANTS.REGISTER_BUTTON;
    private englishVersion: string = CUSTOMER_AGREEMENT_CONSTANTS.ENGLISH_VERSION;
    private spaishVersion: string = CUSTOMER_AGREEMENT_CONSTANTS.SPANISH_VERSION;
    private emailPlaceholder: string = CUSTOMER_AGREEMENT_CONSTANTS.EMAIL_PLACEHOLDER;
    private mobileNumberPlaceholder: string = CUSTOMER_AGREEMENT_CONSTANTS.MOBILE_NUMBER_PLACEHOLDER;

    private customerSummaryResponse$: Observable<CustomerEntityModels.customerSummary>;
    private customerDetailsResponse$: Observable<CustomerEntityModels.customerDetails>;
    private customerSummarySubscription: Subscription;
    private mobileNumber: string;
    private isOtherEmailSelected: boolean;

    private isOtherPhoneNumberSelected: boolean;
    private isPhoneNumberSelected: boolean;
    public isValidPhoneNumber: boolean;
    public isValidEmail: boolean;
    public phoneMask = FormMaskConstants.PHONE_MASK;
    public formPhoneNumber: string;
    public formEmail: string;
    public formLanguage: string;

    private otherEmailTextAreaValue: string;
    private otherPhoneValue: string;
    private newPhoneValue: string;
    public ngOnInit(): void {
        this.isPhoneNumberSelected = false;
        this.isOtherEmailSelected = false;
        this.isOtherPhoneNumberSelected = false;
        this.otherEmailTextAreaValue = "";
        this.newPhoneValue = "";
        this.isValidEmail = false;
        this.isValidPhoneNumber = false;
        this.formPhoneNumber = "";
        this.formEmail = "";
        this.formLanguage = "";

        this.otherPhoneValue = "";
        this.customerSummaryResponse$ = this.customerAgreementsStore.select(
            customerEntityQueries.customerSummary
        );
        this.customerDetailsResponse$ = this.customerAgreementsStore.select(
            customerEntityQueries.customerDetails
        );

        this.customerSummarySubscription = this.customerSummaryResponse$.subscribe(
            (customerDetails: CustomerEntityModels.customerSummary) => {
                if (
                    customerDetails &&
                    customerDetails.identitySummary &&
                    customerDetails.identitySummary.mobileNumber
                ) {
                    this.mobileNumber = customerDetails.identitySummary.mobileNumber;
                }
            }
        );
    }
    public closePopup() {
        let initialContractShareArticlePopup: CustomerAgreementsModels.contractShareArticlePopupModel = Object.assign(
            {},
            initialContractShareArticlePopupState
        );
        this.customerAgreementsStore.dispatch(
            this.customerAgreementsActions.shareArticlePopupClose(initialContractShareArticlePopup)
        );
    }

    public selectedEmails(email: string, isSelected) {
        if (isSelected) {
            this.formEmail = this.formEmail + "," + email;
        } else {
            this.formEmail = this.formEmail.replace(email, "");
        }
        this.formEmail = this.formEmail.replace(/^[,]|[,]$/g, "");
    }

    public selectedPhoneNumbers(phoneNumber: string, isSelected) {
        if (isSelected) {
            if (phoneNumber) {
                this.formPhoneNumber = this.formPhoneNumber + "," + phoneNumber;
            }
            this.isPhoneNumberSelected = true;
        } else {
            this.formPhoneNumber = this.formPhoneNumber.replace(phoneNumber, "");
            this.formPhoneNumber = this.formPhoneNumber.replace(this.newPhoneValue, "");
            this.formPhoneNumber = this.formPhoneNumber.replace(/^[,]|[,]$/g, "");
            this.isPhoneNumberSelected = false;
        }
        this.formPhoneNumber = this.formPhoneNumber.replace(/^[,]|[,]$/g, "");
    }

    public toggleOtherEmail() {
        this.isOtherEmailSelected = !this.isOtherEmailSelected;
        if (!this.isOtherEmailSelected) {
            this.formEmail = this.formEmail.replace(this.otherEmailTextAreaValue, "");
            this.formEmail = this.formEmail.replace(/^[,]|[,]$/g, "");
            // this.otherEmailTextAreaValue = "";
        } else {
            this.formEmail = this.formEmail + "," + this.otherEmailTextAreaValue;
        }
    }

    public toggleOtherPhoneNumber() {
        this.isOtherPhoneNumberSelected = !this.isOtherPhoneNumberSelected;
        if (!this.isOtherPhoneNumberSelected) {
            this.formPhoneNumber = this.formPhoneNumber.replace(this.otherPhoneValue, "");
            this.formPhoneNumber = this.formPhoneNumber.replace(/^[,]|[,]$/g, "");
            // this.otherPhoneValue = "";
        } else {
            this.formPhoneNumber = this.formPhoneNumber + "," + this.otherPhoneValue;
        }
    }

    public commaSepratedEmailValidate($event) {
        this.otherEmailTextAreaValue = $event.target.value; // otherEmail
        this.isValidEmail = this.shareArticlePopupService.commaSepratedEmailValidate($event);
    }

    public getValidEmail($event) {
        if ($event && $event.target && $event.target.value && this.isOtherEmailSelected) {
            if (this.isValidEmail) {
                this.formEmail = this.formEmail + "," + $event.target.value;
            }
        }
    }

    public phoneValidate($event, textBox = "otherPhone") {
        this.isValidPhoneNumber = this.shareArticlePopupService.phoneValidate($event);
        if (textBox === "otherPhone") {
            this.otherPhoneValue = $event.target.value;
        } else if (textBox === "newPhone") {
            this.newPhoneValue = $event.target.value;
        }
    }

    public clearIfInvalid($event) {
        if ($event && $event.target && $event.target.value) {
            let phoneNumberValidationRegex = /\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}/i;
            if (!phoneNumberValidationRegex.test($event.target.value)) {
                $event.target.value = "";
            } else {
                this.formPhoneNumber = this.formPhoneNumber + "," + $event.target.value;
            }
        }
    }

    public phoneMasking(phoneNumber) {
        return this.shareArticlePopupService.phoneMasking(phoneNumber);
    }

    public isFormValid() {
        AppUtil.log("Form data   ", this.formPhoneNumber, "----------------", this.formEmail);
        // return true;
        let isValidOtherPhone = this.shareArticlePopupService.phoneValidate({
            target: { value: this.otherPhoneValue }
        });
        let isValidOtherEmail = this.shareArticlePopupService.commaSepratedEmailValidate({
            target: { value: this.otherEmailTextAreaValue }
        });
        let isValidMobile = this.shareArticlePopupService.phoneValidate({
            target: { value: this.newPhoneValue }
        });
        //  Either formphone or formemail is valid
        if (
            (this.formPhoneNumber && this.formPhoneNumber !== "") ||
            (this.formEmail && this.formEmail !== "")
        ) {
            //  if other phone and other email is not selected
            if (!this.isOtherEmailSelected && !this.isOtherPhoneNumberSelected) {
                return true;
                // if both other phone or other email is selected
            } else if (this.isOtherEmailSelected && this.isOtherPhoneNumberSelected) {
                if (
                    this.isOtherEmailSelected &&
                    (this.otherEmailTextAreaValue &&
                        this.otherEmailTextAreaValue !== "" &&
                        isValidOtherEmail) &&
                    (this.isOtherPhoneNumberSelected &&
                        (this.otherPhoneValue && this.otherPhoneValue !== "" && isValidOtherPhone))
                ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (
                    (this.isOtherEmailSelected &&
                        (this.otherEmailTextAreaValue &&
                            this.otherEmailTextAreaValue !== "" &&
                            isValidOtherEmail)) ||
                    (this.isOtherPhoneNumberSelected &&
                        (this.otherPhoneValue && this.otherPhoneValue !== "" && isValidOtherPhone))
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    public isPreferred(preferredEmail: string, comcastEmail: boolean): boolean {
        return this.shareArticlePopupService.isPreferred(preferredEmail, comcastEmail);
    }

    /**
     * 
     * @param preferredEmailText 
     * @param comcastEmail 
     * @param thirdPartyEmail 
     */
    public getPreferredEmail(
        preferredEmailText: string,
        comcastEmail: string,
        thirdPartyEmail: string
    ): string {
        let preferredEmail: string = "";
        if (preferredEmailText) {
            if (preferredEmailText === "comcastEmail" && comcastEmail) {
                preferredEmail = comcastEmail;
            } else if (preferredEmailText !== "comcastEmail" && thirdPartyEmail) {
                preferredEmail = thirdPartyEmail;
            }
        }
        return preferredEmail;
    }

    /**
     * 
     * @param preferredEmailText 
     * @param comcastEmail 
     * @param thirdPartyEmail 
     */
    public getNonPreferredEmail(
        preferredEmailText: string,
        comcastEmail: string,
        thirdPartyEmail: string
    ): string {
        let nonPreferredEmail: string = "";
        if (preferredEmailText) {
            if (preferredEmailText !== "comcastEmail" && comcastEmail) {
                nonPreferredEmail = comcastEmail;
            } else if (preferredEmailText === "comcastEmail" && thirdPartyEmail) {
                nonPreferredEmail = thirdPartyEmail;
            }
        }
        return nonPreferredEmail;
    }

    public ngOnDestroy() {
        this.customerSummarySubscription.unsubscribe();
    }
}
