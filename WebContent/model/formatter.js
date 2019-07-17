sap.ui.define([
	] , function () {
		"use strict";

		/**
		 * Model que deverá ser utilizado pelas Views para formatação de informações, valores, datas, etc...
		 * Implementar os formatadores conforme necessidade 
		 */
		return {
			
			formatCpf: function (sValue) {
				if (sValue) {
					return sValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4"); 
				}
			}

		};

	}
);
