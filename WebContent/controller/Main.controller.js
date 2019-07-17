sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"ZUI5AG/model/formatter"
], function (Controller, Filter, FilterOperator, JSONModel, MessageBox, formatter) {
	"use strict";

	return Controller.extend("ZUI5AG.controller.Main", {
		
		formatter: formatter,
		
		onInit: function () {
			this.onLoad();
		},
		
		onLoad: function () {
			var that = this;
			this.getView().setBusy(true);
			
			var oModelCarteira = this.getOwnerComponent().getModel("Agenda"); 
			oModelCarteira.read("/AGENDASet",
				{
					success: function(oResultData, oResponse) {
						that.getView().setBusy(false);
						
//						var oModel = new sap.ui.model.json.JSONModel();
//						oModel.setData(oResponse.data.results);
						
//						that.getView().setModel(oModel);

						
						// Pega o retorno do servidor
						var result  = oResultData.results;
						
						// Instancia o Model
						var oModel = new sap.ui.model.json.JSONModel();
						
						// Instancia o Data
						var oData = {};

						// Seta o retorno do servidor no Data
						oData.ListaContatos = result;
						
						// Seta o Data no Model
						oModel.setData(oData);
												
						// Seta o Model na tela
						that.getView().setModel(oModel);
					}, 
					error: function(oError) {
						that.getView().setBusy(false);
						that.showException(oError.responseText);
					}
				}
			);			
		},
		
		onSave: function () {
			var cpf   = this.byId("txtCpf").getValue();
 			var nome  = this.byId("txtNome").getValue();
			var email = this.byId("txtEmail").getValue();
			
			if (!cpf) {
				MessageBox.error("Informe o cpf", {
				    title: "Erro",
				    onClose: null,
				    styleClass: "sapUiSizeCompact"
			    });	
			} else if (!nome) {
				MessageBox.error("Informe o nome", {
				    title: "Erro",
				    onClose: null,
				    styleClass: "sapUiSizeCompact"
			    });						
			} else if (!email) {
				MessageBox.error("Informe o e-mail", {
				    title: "Erro",
				    onClose: null,
				    styleClass: "sapUiSizeCompact"
			    });	
			} else {
				var that = this;
				this.getView().setBusy(true);
												
				var oEntity = {
					Cpf : cpf,	
					Nome : nome,
					Email : email
				};			

				var oModel = that.getOwnerComponent().getModel("Agenda");
				
				oModel.create("/AGENDASet", oEntity,
					{
						success: function (data, response) {
				        	that.getView().setBusy(false);
							MessageBox.success("Operação realizada com sucesso!", {
							    title: "Aviso",
							    onClose: null,
							    styleClass: "sapUiSizeCompact"
						    });
							that.onLoad();
				        	
						},
				        error: function(oError) {
				        	that.getView().setBusy(false);
							MessageBox.error("Erro ao realizar operação!", {
							    title: "Erro",
							    onClose: null,
							    styleClass: "sapUiSizeCompact"
						    });				        	
				        	
				        }
					}
				);
			}			
		},
		
		onEdit: function(oEvent) {
			var oSource = oEvent.getSource();
			var sPath   = oSource.getBindingContext().getPath();
			var oModel  = oSource.getModel();
			var oRow    = oModel.getProperty(sPath);			
						
			this.byId("txtCpf").setValue(oRow.Cpf);
			this.byId("txtNome").setValue(oRow.Nome);
			this.byId("txtEmail").setValue(oRow.Email);
		},
		
		onDelete: function(oEvent) {
			var that 	= this;
			var oSource = oEvent.getSource();
			var sPath   = oSource.getBindingContext().getPath();
			var oModel  = oSource.getModel();
			var oRow    = oModel.getProperty(sPath);	
			
			var fnCallbackMessageBox = function(sResult) {
				
				if (sResult === MessageBox.Action.YES) {
					that.getView().setBusy(true);
					
					var oModel = that.getOwnerComponent().getModel("Agenda"); 
					
					oModel.remove("/AGENDASet('" + oRow.Cpf + "')", 
						{
							success: function (data, response) {
				        		that.getView().setBusy(false);
								MessageBox.success("Operação realizada com sucesso!", {
								    title: "Aviso",
								    onClose: null,
								    styleClass: "sapUiSizeCompact"
							    });
								that.onLoad();
					        }, 
					        error: function(oError) {
					        	that.getView().setBusy(false);
								MessageBox.error("Erro ao realizar operação!", {
								    title: "Erro",
								    onClose: null,
								    styleClass: "sapUiSizeCompact"
							    });	
					        }
						}
					);					
				}
			}
                        
			MessageBox.show("Confirma a exclusão do contato '" + oRow.Nome + "'?", {
					icon: MessageBox.Icon.QUESTION,
    				title: "Excluir",
    				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
    				onClose: fnCallbackMessageBox
				});
		},
		
		onSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");

			this._oGlobalFilter = new Filter([
				new Filter("Cpf", FilterOperator.Contains, sQuery),
				new Filter("Nome", FilterOperator.Contains, sQuery),
				new Filter("Email", FilterOperator.Contains, sQuery)
			], false);
		
			var oFilter = this._oGlobalFilter;
			this.getView().byId("tbAgenda").getBinding("items").filter(oFilter, "Application");		
		},
				
		showDetail: function(oEvent) {		
			var oSource = oEvent.getSource();
			var sPath   = oSource.getBindingContext().getPath();
			var oModel  = oSource.getModel();
			var oRow    = oModel.getProperty(sPath);			
			
			this.getOwnerComponent().getRouter().navTo("detail", { cpf: oRow.Cpf });
		},
		
		formatCpf2: function (value) {
			if (value) {
				return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4"); 
			}
		},
		
		_unFormatCpf: function (source) {
			return source.replace(/(\.|\/|\-)/g,"");
		}
	
	});
});