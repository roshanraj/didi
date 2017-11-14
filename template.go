package main

func FunctionTemplate() string {
	return ""
}

func NewTemplate() string {
	template := `import { Component, OnInit } from "@angular/core";
		import { Store } from "@ngrx/store";
		import { CustomerAgreementsActions } from "../../domain/actions";
		import { {{.ClassName}} } from "./base-contract.component";
		
		describe("CustomerAgreementsBaseComponent", () => {
			let comp: BaseContractComponent;
			let store: Store<any>;
			let actions: CustomerAgreementsActions;
		
			beforeEach(() => {
				comp = new {{.ClassName}}(store, actions);
			});
			{{ range $key, $value := .FunctionName }}
				it("{{.ClassName}} should have {{$value}} function defined ", () => {
					expect(comp.{{$value}}).toBeDefined();
				});
				it("  should have {{$value}} defined as function", () => {
					expect(typeof comp.{{$value}}).toBe("function");
				});
		 	{{ end }}
			}`
	return template
}

// <li><strong>{{ $key }}</strong>: {{ $value }}</li>
