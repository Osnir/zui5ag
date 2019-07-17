sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"ZUI5AG/model/formatter"
], function (Controller, Filter, FilterOperator, JSONModel, MessageBox, formatter) {
	"use strict";

	return Controller.extend("ZUI5AG.controller.Detail", {
		
		formatter: formatter,
		
		onInit: function () {
			this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteFound, this);
		},
		
		_onRouteFound: function(oEvent) {
			if (!oEvent || oEvent.getParameters().name === "detail") {
				var oArgument = oEvent.getParameters().arguments;
				var cpf = oArgument.cpf;
				
				var that   = this;
				var oModel = that.getOwnerComponent().getModel("Agenda"); 
				
				oModel.read("/AGENDASet('" + cpf + "')", 
						{
							success: function (data, response) {
				        		that.getView().setBusy(false);
				        		
				        		that.byId("txtCpf").setValue(data.Cpf);
				        		that.byId("txtNome").setValue(data.Nome);
				        		that.byId("txtEmail").setValue(data.Email);
				        		
					        }, 
					        error: function(oError) {
					        	that.getView().setBusy(false);
								MessageBox.error("Erro ao buscar registro!", {
								    title: "Erro",
								    onClose: null,
								    styleClass: "sapUiSizeCompact"
							    });	
					        }
						}
					);	
				
			}
		},
		
		onNavToHome: function() {
			this.getOwnerComponent().getRouter().navTo("main");
		}
	
	});
});