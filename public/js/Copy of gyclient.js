
$(function() {
	
		function retrunFalse(){
			return false;
		}
		function retrunTrue(){
			return true;
		}
		$(".ajaxMsgDiv").ajaxStart(function(){
			var zIx	=	parseInt($('.ui-widget-overlay').css('z-index'));
			zIx	+=	4;
			$(this).css({'z-index':zIx});
		   $(this).show();
		   $('div,span,li,a,input[type="submit"]').die( "click",retrunTrue);
			$('div,span,li,a,input[type="submit"]').live('click',retrunFalse );
		 });
		$('.ajaxMsgDiv').ajaxStop(function() {
			var zIx	=	parseInt($('.ui-widget-overlay').css('z-index'));
			zIx	+=	4;
			$(this).css({'z-index':zIx});
			$(this).hide();
			$('.btnLoading').hide();
			$('div,span,li,a,input[type="submit"]').die( "click",retrunFalse );
			$('div,span,li,a,input[type="submit"]').live('click',retrunTrue);			
		});
		$('.ajaxMsgDiv').ajaxError(function() {
			var zIx	=	parseInt($('.ui-widget-overlay').css('z-index'));
			zIx	+=	4;
			$(this).css({'z-index':zIx});
			$(this).hide();
			$('.btnLoading').hide();
			$('div,span,li,a,input[type="submit"]').die( "click",retrunFalse );
			$('div,span,li,a,input[type="submit"]').live('click',retrunTrue);			
		});
		var oTable;
		var gaiSelected =  [];
		
		$( ".datepickerMY" ).datepicker({ 
			changeMonth: true,
	        changeYear: true,
			"dateFormat": 'dd/mm/yy',
			showButtonPanel: true,
			onClose: function(dateText, inst) { 
		            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
		            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
		            $(this).datepicker('setDate', new Date(year, month, 1));
		    }
		});		
		var nCloneTh = document.createElement('th');
		var nCloneTd = document.createElement('td');
		nCloneTd.innerHTML = '<img src="/images/details_open.png" class="amBtn">';
		nCloneTd.className = "center";
		
		$('#grid thead tr').each( function () {
			this.insertBefore( nCloneTh, this.childNodes[0] );
		});
		
		$('#grid tbody tr').each( function () {
			this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
		});
		
		function fnBankDetails ( oTable, nTr ,data)
		{
			var aData = oTable.fnGetData( nTr );	
			var userid	=	nTr.id.split('_');
			var sOut = '<div class="bankShowBtn slideTable rightArrow" catch="bankTable_'+userid[1]+'" status="0">Detalle bancario</div>';
			sOut += 	'<table class="whiteTable details-table"  style="display:none;" id="bankTable_'+userid[1]+'">';
			sOut += '<tr><th>Banco</th><th>Sucursal</th><th>Nro. de Cuenta</th><th>Fecha de Alta</th><th>Acciones</th></tr>';
			var opendate,x;
			var RowCount = 0;
				for(x in data){
					RowCount = 1;
					item = data[x];
					sOut += '<tr id="bankid_'+item['id']+'">';
					sOut += 	'<td class="td_bank_name">'+
												item['bank_name']+
												'<input type="hidden" name="zip_code" value="'+item['zip_code']+'" />'+
												'<input type="hidden" name="location_capital" value="'+item['location_capital']+'" />'+												
									'</td>';
					sOut += 	'<td class="td_branch">'+item['branch']+'</td>';
					sOut += 	'<td class="td_account_n">'+item['account_n']+'</td>';
					
					opendate = item['opening_date'];
					if(opendate == null){
						opendate = 'Not Specified';
					}
					sOut += 	'<td  class="td_opening_date">'+opendate+'</td>';
					sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editBankBtn"/> <img src="/images/delete.png" class="deleteBankBtn"/></span></td>';
					sOut += '</tr>';					
			}
			if(!RowCount){
				sOut += '<tr>';
				sOut += 	'<td class="td_bank_name" colspan="5" align="center">No hay detalles bancarios.</td>';
				sOut += '</tr>';
			}
			sOut += '<tr>';
			sOut += 	'<td  colspan="5" align="right">';
			sOut += 		'<span title="" class="ui-state-default ui-corner-all addNewBankBtn"><span class="jq-link-btn">Agregar Nuevo</span></span>';
			sOut += 	'</td>';
			sOut += '</tr>';
			sOut += '</table>';
			return sOut;
		}
		function fnAddressDetails ( oTable, nTr ,data)
		{
			var aData = oTable.fnGetData( nTr );			
			var client_id	=	nTr.id.split('_');
			var sOut = '<div class="addressShowBtn slideTable rightArrow" catch="addressTable_'+client_id[1]+'" status="0">Domicilios</div>';
			sOut += '<table class="whiteTable details-table" style="display:none;" id="addressTable_'+client_id[1]+'">';
			sOut += '<tr><th>Domicilio</th><th>Localidad</th><th>C.P.</th><th>Provincia</th><th>Tipo de Domicilio</th><th>Env&iacute;o</th><th>Acciones</th></tr>';
			var opendate,x;
			var RowCount = 0;
				for(x in data){
					item = data[x];
					RowCount = 1;
					var jsonData			=	item;
					var id					=	jsonData['id'];
					var street				=	jsonData['street'];
					var city				=	jsonData['city'];
					var state				=	jsonData['state'];
					var state_name			=	jsonData['state_name'];
					var country				=	jsonData['country'];
					var zip_code			=	jsonData['zip_code'];
					var address_type		=	jsonData['address_type'];
					var delivery_address	=	jsonData['delivery_address'];
					
				
					var delivery_address	=	parseInt(jsonData['delivery_address'])?'Si':'';
					
					sOut += '<tr id="addressid_'+id+'">';
					sOut += 	'<td class="td_street">'+street+'</td>';
					sOut += 	'<td class="td_city">'+city+'</td>';
					sOut += 	'<td class="td_zip_code">'+zip_code+'</td>';
					sOut += 	'<td class="td_state">'+state_name+'<input type="hidden" value="'+state+'" /></td>';
					sOut += 	'<td class="td_address_type">'+address_type+'</td>';
					sOut += 	'<td class="td_delivery_address">'+delivery_address+'</td>';
					sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editAddBtn"/></span></td>';
					/*sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editAddressBtn"/> <img src="/images/delete.png" class="deleteAddressBtn"/></span></td>';*/
					sOut += '</tr>';					
			}
			if(!RowCount){
				sOut += '<tr>';
				sOut += 	'<td class="td_address_name" colspan="7" align="center">No hay domicilios cargados.</td>';
				sOut += '</tr>';
			}
			sOut += '<tr>';
			sOut += 	'<td  colspan="7" align="right">';
			sOut += 		'<span title="" class="ui-state-default ui-corner-all addNewAddBtn"><span class="jq-link-btn">Agregar Nuevo</span></span>';
			sOut += 	'</td>';
			sOut += '</tr>';
			sOut += '</table>';			
			return sOut;
		}
		function fnPriorDetails ( oTable, nTr ,data)
		{
			var aData = oTable.fnGetData( nTr );	
			var client	=	nTr.id.split('_');
			var sOut = '<div class="priorShowBtn slideTable rightArrow" catch="priorTable_'+client[1]+'" status="0">Operaciones con otros proveedores</div>';
			sOut += '<table class="whiteTable details-table"  style="display:none;" id="priorTable_'+client[1]+'">';
			sOut += '<tr><th>Fecha</th><th>Colega</th><th>Importe</th><th>Fecha Próximo Cheque</th><th>Cheques Pendientes</th></tr>';
			var opendate,x;
			var RowCount = 0;
			for(x in data){
					item = data[x];
					RowCount = 1;
					var jsonData				=	item;
					var id						=	jsonData['id'];
					var date					=	jsonData['date'];
					var is_operation_completed	=	jsonData['is_operation_completed'];
					var cave_name				=	jsonData['cave_name'];
					var cave_name_db			=	jsonData['cave_name_db'];
					var amount					=	jsonData['amount'];
					var next_check_date			=	jsonData['next_check_date'];
					var pending_checks			=	jsonData['pending_checks'];
					var is_last_operation		=	jsonData['is_last_operation'];
					sOut += '<tr id="priorid_'+id+'">';
					sOut += 	'<td class="td_data">'+date+'</td>';
					sOut += 	'<td class="td_cave">'+cave_name_db+'</td>';
					sOut += 	'<td class="td_amount">'+amount+'</td>';
					sOut += 	'<td class="td_next_check_date">'+next_check_date+'</td>';
					sOut += 	'<td class="td_pending_checks">'+pending_checks+'</td>';
					/*sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editPriorBtn"/> <img src="/images/delete.png" class="deletePriorBtn"/></span></td>';*/
					sOut += '</tr>';					
			}
			if(!RowCount){
				sOut += '<tr>';
				sOut += 	'<td class="td_prior_name" colspan="5" align="center">No hay detalles de operaciones anteriores.</td>';
				sOut += '</tr>';
			}
			sOut += '<tr>';
			sOut += 	'<td  colspan="7" align="right">';
			sOut += 		'<span title="" class="ui-state-default ui-corner-all addPriorAddBtn"><span class="jq-link-btn">Agregar Nuevo</span></span>';
			sOut += 	'</td>';
			sOut += '</tr>';
			sOut += '</table>';			
			return sOut;
		}
		function fnChequeDetails ( oTable, nTr ,data)
		{
			var client_id,balance,check_n,x,status,payment_type,payment_type_name,cobranzas_count,addCls,pro_name,cave_name,supplier_name;
			var aData = oTable.fnGetData( nTr );			
			client_id	=	nTr.id;
			client_id	=	client_id.split('_');
			client_id	=	client_id[1];
			var sOut = '<table class="whiteTable operation-details-table" id="chequesTable_'+client_id+'">';
			sOut += '<tr><th>Fecha</th><th>N Cheque</th><th>Importe</th><th>Estado</th><th>Detalle</th><th>Acciones</th></tr>';
			
			var rejBtn		=	' <img src="/images/cancel.png" class="rejectChequeBtn" /> ';
			var payedBtn	=	' <img src="/images/accept.png" class="payedChequeBtn"  /> ';
			var RowCount = 0;
				for(x in data){
					RowCount = 1;
					item = data[x];
					status = parseInt(item['status']);
					addCls	=	'';
					if(status == 3){
						addCls	=	'lightRedTr';					
					}
					sOut += '<tr id="chequelistid_'+item['id']+'" class="'+addCls+'">';
					sOut += 	'<td class="td_date">'+item['date']+'</td>';
					check_n = item['check_n'];
					if(check_n == null){
						check_n = 'Not Specified';
					}
					
					
					payment_type	=	parseInt(item['rejected_check_payment']);
					switch(payment_type){
						case 1:
							payment_type_name	=	' (Cheque Propio)';
						break;
						case 2:
							payment_type_name	=	' (Cheque Tercero)';
						break;	
						default:
							payment_type_name	=	'';
						break;
					}
					if(item['balance']){
						balance	=	item['balance'];
						if(balance	==	'0.00')
						{
							balance	=	'Pagado';
						}
					}else{
						balance	=	'';
					}
					pro_name	=	'';
					if(status	==	4){						
						cave_name		=	item['cave_name'];
						supplier_name	=	item['supplier_name'];
						if(cave_name){
							pro_name	=	cave_name;
						}else if(supplier_name){
							pro_name	=	supplier_name;
						}
					}
					sOut += 	'<td class="td_check_n">'+check_n+'</td>';
					sOut += 	'<td class="td_amount">'+parseFloat(item['amount']).toFixed(2)+'</td>';
					sOut += 	'<td class="td_status_name">'+item['status_name']+payment_type_name+'</td>';
					sOut += 	'<td class="td_rej_balance">'+balance+' '+pro_name+'</td>';
					sOut += 	'<td class="td_actions">';
					
					if(status == 4 || status == 1 || status == 2 ){
						sOut += 	rejBtn;
						//sOut += 	payedBtn;						
					}
					cobranzas_count	=	parseInt(item['cobranzas_count']);
					if(status	==	3 && cobranzas_count){
						sOut +=	'<span class="ui-state-default ui-corner-all addNewGdc" title="" id="OpClientIduserid_'+client_id+'"><span class="jq-link-btn">Gestión de Cobranza</span></span>';
					}else if(status	==	3 && cobranzas_count	==	0){
						sOut +=	'<span class="ui-state-default ui-corner-all" title="" id="OpClientIduserid_'+client_id+'"><span class="jq-link-btn">Accrediation</span></span>';
					}
					sOut += 	'</td>';
					sOut += '</tr>';					
			}
			if(!RowCount){
				sOut += '<tr>';
				sOut += 	'<td class="td_cheques" colspan="6" align="center">No hay cheques agreagados.</td>';
				sOut += '</tr>';
			}
			/*sOut += '<tr>';
			sOut += 	'<td  colspan="5" align="right">';
			sOut += 		'<span id="OpClientIduserid_182" title="" class="operationStepSix ui-state-default ui-corner-all ui-state-default ui-corner-all row_selected">';
			sOut +=				'<span class="jq-link-btn">Editar Cheques';
			sOut +=				'<input type="hidden" value="146" name="operationid">';
			sOut +=				'<input type="hidden" value="243.00" name="amount">';
			sOut +=				'<input type="hidden" value="0" name="cave_id">';
			sOut +=				'<input type="hidden" value="14" name="state_id">';
			sOut +=		'</span></span>';		
			sOut += 	'</td>';
			sOut += '</tr>';*/
			sOut += '</table>';
			return sOut;
		}
		$('.addressShowBtn').live('click',function(){
			var slideTable	=	$(this);
			var client_id	=	slideTable.attr('catch');
			var status		=	parseInt(slideTable.attr('status'));
			var tablefop	=	slideTable.parents('table:eq(0)');
			if(status){
				$('#'+client_id,tablefop).slideUp('fast',function(){
					slideTable.attr('status',0).removeClass('downArrow').addClass('rightArrow')
					.text('Domicilios');
				});
			}else{
				slideTable.attr('status',1).removeClass('rightArrow').addClass('downArrow')
				.text('Domicilios');
				$('#'+client_id,tablefop).slideDown('fast');
			}
		});
		$('.priorShowBtn').live('click',function(){
			var slideTable	=	$(this);
			var client_id	=	slideTable.attr('catch');
			var status		=	parseInt(slideTable.attr('status'));
			var tablefop	=	slideTable.parents('table:eq(0)');
			if(status){
				$('#'+client_id,tablefop).slideUp('fast',function(){
					slideTable.attr('status',0).removeClass('downArrow').addClass('rightArrow')
					.text('Operaciones con otros proveedores');
				});
			}else{
				slideTable.attr('status',1).removeClass('rightArrow').addClass('downArrow')
				.text('Operaciones con otros proveedores');
		
				$('#'+client_id,tablefop).slideDown('fast');
			}
		})
		$('.bankShowBtn').live('click',function(){
			var slideTable	=	$(this);
			var client_id	=	slideTable.attr('catch');
			var status		=	parseInt(slideTable.attr('status'));
			var tablefop	=	slideTable.parents('table:eq(0)');
			if(status){
				
				$('#'+client_id,tablefop).slideUp('fast',function(){
					slideTable.text('Detalle bancario').attr('status',0).removeClass('downArrow').addClass('rightArrow');
				});
			}else{
				slideTable.text('Detalle bancario').attr('status',1).removeClass('rightArrow').addClass('downArrow');
				$('#'+client_id,tablefop).slideDown('fast');
			}
		})
		$('#grid tbody td .amBtn').live('click', function (e,showLoading) {
			var nTr = this.parentNode.parentNode;
			var trdet	=	$(this).parents('tr:eq(0)');
			userid = nTr.id.split('_');
			var amBtnImg	=	$(this);
			$(this).addClass('amBtnLoading');
			var img = this;
			trdet.next('tr').find('.details').addClass('fnTableLoading');
			
			if ( this.src.match('details_close') && !showLoading)
			{
				this.src = "/images/details_open.png";
				oTable.fnClose( nTr );
				
				amBtnImg.removeClass('amBtnLoading');
			}
			else
			{
				trdet.next('tr').find('.details').addClass('fnTableLoading');
				this.src = "/images/details_close.png";
				var url = '/index/getalldetailsbyclientidajax';
				$.post(url, { 
					"client_id"   : userid[1]
					},				
					 function(data){
						if(data){
								var bankdetails		=	data['bankdetails'];
								bankdetailsHTML		=	fnBankDetails(oTable, nTr,bankdetails);
								var addresses		=	data['addresses'];
								addressesHTML		=	fnAddressDetails(oTable, nTr,addresses);								
								var prior			=	data['prior'];
								priorHTML			=	fnPriorDetails(oTable, nTr,prior);
								var stateList	=	data['statedetails'];
								var cave_name=stateDetailsHTML=operationsHTML=statustime=date_added=rejectedBtn=statusTxt=nextClsName=nextBtnText=operationInp=amountInp=stateid=amountInp=stateid=operationid=amount	=	'';
								if(stateList){
									var stateDetailsHTMLArr =	new Array();
									var date_addedArr		=	new Array();
									var amountArr			=	new Array();
									var cave_nameArr		=	new Array();
									for(var x in stateList){
										var stateDetails	=	stateList[x];
										stateid		=	parseInt(stateDetails['stateid']);
										operationid		=	stateDetails['operationid'];
										amount			=	stateDetails['amount'];
										date_added		=	stateDetails['date'];
										cave_name		=	stateDetails['cave_name'];
										cave_id			=	parseInt(stateDetails['cave_id'])?parseInt(stateDetails['cave_id']):0;
										statustime		=	stateDetails['state_change']+' hs';
										operationInp	=	'<input type="hidden" name="operationid" value="'+operationid+'"/>';
										amountInp		=	'<input type="hidden" name="amount" value="'+amount+'"/>';
										
										pdf_Arr		=	pdfSwitch(stateid,statustime,cave_id);
										pdf_list	=	pdf_Arr['pdf_list'];
										statusTxt	=	pdf_Arr['statusTxt'];
										nextClsName	=	pdf_Arr['nextClsName'];
										nextBtnText	=	pdf_Arr['nextBtnText'];
										rejectedBtn	=	pdf_Arr['rejectedBtn'];
										
										stateDetailsHTML	=	'<td rowspan=2" valign="top">'+statusTxt;
										if(nextClsName){
											nextClsName	+=	' ui-state-default ui-corner-all';
										}
										stateBtnHTML	=	'<span class="'+nextClsName+'" title="" id="OpClientId'+nTr.id+'">';
										stateBtnHTML	+=	'<span class="jq-link-btn">'+nextBtnText+operationInp+amountInp;
										stateBtnHTML	+=	'<input type="hidden" name="cave_id" value="'+cave_id+'" />';
										stateBtnHTML	+=	'<input type="hidden" name="show_cheques" value="" />';
										stateBtnHTML	+=	'<input type="hidden" name="state_id" value="'+stateid+'" /></span></span>';
										stateDetailsHTML	+=	stateBtnHTML+rejectedBtn+pdf_list+'</td>';
										stateDetailsHTMLArr[operationid]	=	stateDetailsHTML;
										amountArr[operationid]			=	amount;
										date_addedArr[operationid]		=	date_added;
										cave_nameArr[operationid]		=	cave_name;
									}
								}
								if(data['cheques']){
									var cheques			=	data['cheques'];
									for(var x in cheques){
										chequesHTML		=	fnChequeDetails(oTable, nTr,cheques[x]);
										operationsHTML	+=	'<table class="user-panel-table operations-table"><tr><td><table class="whiteTable operation-details-table"><tr><td class="tc" colspan="3"><span class="bct"> Operación No: '+ x	+'</span></td></tr>';
										operationsHTML	+=	'<tr><td class="tc"><span class="bct"> Fecha: '+date_addedArr[x]+'</span></td><td><span class="bct"> Importe: $ '+amountArr[x]+'</span></td>';
										if(cave_nameArr[x]){
											operationsHTML	+=	'<td class="tc"><span class="bct"> A medias con '+cave_nameArr[x]+'</span></td>';
										}else{
											operationsHTML	+=	'<td class="tc"><span class="bct"></span></td>';
										}										
										operationsHTML	+=	'</tr></table></td>';
										operationsHTML	+=	stateDetailsHTMLArr[x]+'</tr>';
										operationsHTML	+=	'<tr><td>'+	chequesHTML	+'</td></tr></table>';
									}
									amountArr	=	date_addedArr	=	stateDetailsHTMLArr	=	null;
								}
								var newoprBtn=tProfile=dni=tc=tl=ln=fn=clientDetials=''; 
								fn	=	$('.user_first_name',nTr).text();
								ln	=	$('.user_last_name',nTr).text();
								dni	=	$('.user_DNI',nTr).text();
								tc	=	$('.user_tel_cell',nTr).text();
								tl	=	$('.user_tel_part',nTr).text();
								
								newoprBtn	=	'<span id="OpClientIduserid_'+userid[1]+'" title="" class="ui-state-default ui-corner-all addNewOperations"><span class="jq-link-btn">Nueva Operación</span></span>';
								gdcBtn		=	'<span id="OpClientIduserid_'+userid[1]+'" title="" class="ui-state-default ui-corner-all addNewGdc"><span class="jq-link-btn">Gestión de Cobranza</span></span>';
								inPegoBtn	=	'<span id="OpClientIduserid_'+userid[1]+'" title="" class="ui-state-default ui-corner-all addNewInsPago"><span class="jq-link-btn">Insertar Pago</span></span>';
																
								tProfile	= '<table class="fnOpenTable"><tr><td>';
								tProfile	+= '<div><img src="/images/person.png">';
								tProfile	+= '<div style="float:right">';
								tProfile	+= '<p class="bct">'+fn+' '+ln+'</p>';
								tProfile	+= '<p class="bct client-details">DNI: '+dni+'</p>';
								tProfile	+= '<p class="bct client-details">Celular: '+tc+'</p>';
								tProfile	+= '<p class="bct client-details">Tel: '+tl+'</p>';
								tProfile	+= '</div></div></td></tr>';
								tProfile	+= '<tr><td>'+newoprBtn+'</td></tr>';
								tProfile	+= '<tr><td>'+gdcBtn+'</td></tr>';
								tProfile	+= '<tr><td>'+inPegoBtn+'</td></tr>';
								tProfile	+= '</table>';
								
								/*tProfile	= '<table class="fnOpenTable">';
								tProfile	+= '<tr><td class="bct"><img src="/images/person.png"/>'+fn+' '+ln+'</td></tr>';
								tProfile	+= '<tr><td class="bct">DNI: '+dni+'</td></tr>';
								tProfile	+= '<tr><td class="bct">Celular: '+tc+'</td></tr>';
								tProfile	+= '<tr><td class="bct">Tel: '+tl+'</td></tr>';
								tProfile	+= '<tr><td>'+newoprBtn+'</td></tr>';
								tProfile	+= '<tr><td>'+gdcBtn+'</td></tr>';
								tProfile	+= '<tr><td>'+inPegoBtn+'</td></tr>';
								tProfile	+= '</table>';*/
								
								var finalTable = '<table class="user-panel-table">'+
													'<tr valign="top"><td style="width:270px; border-right:1px solid #ccc">'+tProfile+'</td><td><div class="detail-tables">'+ bankdetailsHTML +'</div><div class="detail-tables">'+ addressesHTML +'</div><div class="detail-tables">'+ priorHTML+'</div></td></tr></table>';
							
								/*var finalTable = '<table class="fnOpenTable">'+
													'<tr><td>'+	bankdetailsHTML	+'</td><td rowspan="3">'+tProfile+'</td></tr>'+
													'<tr><td>'+	addressesHTML	+'</td></tr>'+
													'<tr><td>'+	priorHTML		+'</td></tr>';*/
								finalTable +=	operationsHTML;
								//finalTable +='</table>';
								oTable.fnClose( nTr );
								oTable.fnOpen( nTr, finalTable, 'details' );
								//trdet.next('tr').find('.details').removeClass('fnTableLoading');
								amBtnImg.removeClass('amBtnLoading');
							 
							
						}
				},'json');
			}			
		});
		$( "#newOperations" ).dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 600,			
			buttons: {
				"Crear Operación": function(){	
						$("#operationsForm").submit();
				},
				Cancel: function(){
					$(this).dialog('close');
				}
			}
		});
		$( ".EditPriorFromClientPanel" ).dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 600,			
			buttons: {
				"Crear Operación": function(){	
						$("#EditPriorClientForm").submit();
				},
				Cancel: function(){
					$(this).dialog('close');
				}
			}
		});
		
		$( "#insertPayment" ).dialog({
			autoOpen: false,modal:true,
			height: 600,
			width: 800,			
			buttons: {
				"Guardar": function(){	
					$("#insertPaymentForm").submit();
				},
				Cancel: function(){
					$(this).dialog('close');
				}
			}
		});
		$( "#Plans" ).dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 600,
			
			buttons: {
				'Cerrar Operacion': function() {
						$("#plansForm").submit();
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});		
		$("#PlansEdit").dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 800,			
			buttons: {
				'Guardar': function() {
						$("#plansEditForm").submit();
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});
		$(".rejected_cheques_payment").dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 800,			
			buttons: {
				'Insertar Pago': function() {
					var client_id	=	$('.rejected_cheques_payment [name="client_id"]').val();
					$('#grid #userid_'+client_id).next('tr').find('.addNewInsPago').trigger('click');					
				},
				'Cerrar': function() {
					$(this).dialog('close');
				},
			},
			close: function(event, ui)
	        {
				$('.rejected_cheques_payment [name="rcp_status"]').val(0);
	        },
	        open: function(event, ui)
	        {
	        	$('.rejected_cheques_payment [name="rcp_status"]').val(1);
	        },
		});
		
		$('.pdfBtnPop').live('click',function(){
			var url = '/index/generatepdf';
			var clientid = $(this).parents('td').find('[id*="OpClientIduserid_"]').attr('id').split('_');
			var operationid = $(this).parents('td').find('[name="operationid"]').val();
			clientid	=	clientid[1];
			typeid		=	$(this).parent('.details_pdf').find('input:hidden').val();
			url += "/clientid/"+clientid+"/typeid/"+typeid+'/status/0/operationid/'+operationid;
			window.location	= url;
			
		});
		$('.pdfBtnNew').live('click',function(){
			var url = '/index/generatepdf';
			var clientid = $(this).parents('td').find('[id*="OpClientIduserid_"]').attr('id').split('_');
			var operationid = $(this).parents('td').find('[name="operationid"]').val();
			clientid	=	clientid[1];
			typeid		=	$(this).parent('.details_pdf').find('input:hidden').val();
			url += "/clientid/"+clientid+"/typeid/"+typeid+'/status/1/operationid/'+operationid;
			window.open(url,'_blank');
		});
		$('.addNewOperations').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var bankDetailsTable	=	$(this).parents('.user-panel-table:eq(0)');
			bankDetailsTable		=	$('table[id^="bankTable_"]',bankDetailsTable);
			var bankoptions	= bankidvar =	bankname	=	acnumber	=	'';
			//bankoptions	=	'<option value="">Select</option>';
			$('tr[id^="bankid_"]',bankDetailsTable).each(function(){
				bankid		=	$(this).attr('id').split('_');	
				bankname	=	$('.td_bank_name',this).text();
				acnumber	=	$('.td_account_n',this).text();
				bankoptions	+=	'<option value="'+bankid[1]+'">'+bankname+' '+acnumber+'</option>'
			});
			$('[name="bank_account_id"]',tform).html(bankoptions);
			$('[name="bank_account_id"] option:last',tform).attr('selected','selected');
			$( "#newOperations" ).dialog('open');
			var clientid = $(this).attr('id').split('_');
			var tform = $('#operationsForm');
			$('[name="client_id"]',tform).val(clientid[1]);
			$('[name="date"]',tform).val(currentDate);			
			$('.opClientName',tform).text($('#userid_'+clientid[1]+' .user_first_name').text()+' '+$('#userid_'+clientid[1]+' .user_last_name').text());
			$('.btnLoading',this).hide();
		});	
		$('.addNewInsPago').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			$( "#insertPayment" ).dialog('open');
			var bankDetailsTable	=	$(this).parents('.user-panel-table:eq(0)');

			bankDetailsTable		=	$('table[id^="bankTable_"]',bankDetailsTable);
			var date	=	bankoptions	= bankidvar =	bankname	=	acnumber	=	'';
			//bankoptions	=	'<option value="">Select</option>';
			$('tr[id^="bankid_"]',bankDetailsTable).each(function(){
				bankid		=	$(this).attr('id').split('_');	
				bankname	=	$('.td_bank_name',this).text();
				acnumber	=	$('.td_account_n',this).text();
				
				
				bankoptions	+=	'<option value="'+bankid[1]+'">'+bankname+' '+acnumber+'</option>';
			});
			$('[name="bank_account_id"]',tform).html(bankoptions);
			$('[name="bank_account_id"] option:last',tform).attr('selected','selected');
			
			var clientid = $(this).attr('id').split('_');
			var tform = $('#insertPaymentForm');
			$('[name="client_id"]',tform).val(clientid[1]);
			$('[name="date"]',tform).val(currentDate);			
			$('.opClientName',tform).text($('#userid_'+clientid[1]+' .user_first_name').text()+' '+$('#userid_'+clientid[1]+' .user_last_name').text());
			var url = '/index/getrejedchequescteyclientidajax';
			$.post(url, { 
				"client_id" 	: clientid[1]
				},
				function(data){	
					if(data){
						var rejDrp	=	$('[name="rejected_cheques"]',tform);
						var item,check_n,amount,option = '';
						option	+=	'<option value="">Select</option>';
						for(var x in data){
							item		=	data[x];
							check_n		=	item['check_n'];
							id			=	item['id'];
							bank_name	=	item['bank_name'];
							balance		=	item['balance'];
							date		=	item['date'];	
							operation_id	=	item['operation_id'];
							option	+=	'<option value="'+id+'" balance="'+balance+'" operation_id="'+operation_id+'">'+check_n+' '+bank_name+' '+date+'</option>';
						}
						rejDrp.html(option);
						
					}
				
			},'json');
			$('.btnLoading',this).hide();
		});	
		$('#insertPaymentForm [name="payment_type"]').live('change',function(){
			var payment_type	=	parseInt($(this).val());
			var tForm			=	$('#insertPaymentForm'); 
			switch(payment_type){
					case 1:
						$('.own_cheque_table',tForm).hide();
						$('.third_party_cheque_table',tForm).hide();
						$('.own_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
						$('.third_party_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
					break;	
					case 2:
						$('.own_cheque_table',tForm).show();
						$('.third_party_cheque_table',tForm).hide();
						$('.own_cheque_table .notrequired',tForm).addClass('required').removeClass('notrequired');
						$('.third_party_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
					break;
					case 3:
						$('.own_cheque_table',tForm).hide();
						$('.third_party_cheque_table',tForm).show();
						$('.own_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
						$('.third_party_cheque_table .notrequired',tForm).addClass('required').removeClass('notrequired');
				   break;
					default:
						$('.own_cheque_table',tForm).hide();
						$('.third_party_cheque_table',tForm).hide();
						$('.own_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
						$('.third_party_cheque_table .required',tForm).addClass('notrequired').removeClass('required');
					break;	
			}
		});
		$('#insertPaymentForm [name="rejected_cheques"]').live('change',function(){
			$('#insertPaymentForm [name="operation_id"]').val($('option:selected',this).attr('operation_id'));
			$('#insertPaymentForm [name="previous_balance"]').val($('option:selected',this).attr('balance'));
		});
		$('#insertPaymentForm [name="paid_amount"]').live('blur',function(){
			var prev_bal		=	parseFloat($('#insertPaymentForm [name="previous_balance"]').val());
			var amount_paying	=	parseFloat($(this).val());
			balance	=	(prev_bal - amount_paying).toFixed(2);
			if(!balance || balance == 'NaN'){
				balance	=	'';
			}
			$('#insertPaymentForm [name="current_balance"]').val(balance);
		});
		$('#insertPaymentForm .own_cheque_table [name="amount"]').live('keyup',function(){
			$('#insertPaymentForm [name="paid_amount"]').val($(this).val());
		});
		$('#insertPaymentForm .own_cheque_table [name="amount"]').live('blur',function(){
			$('#insertPaymentForm [name="paid_amount"]').trigger('blur');
		});
		$('#insertPaymentForm .third_party_cheque_table [name="new_amount"]').live('keyup',function(){
			$('#insertPaymentForm [name="paid_amount"]').val($(this).val());
		});
		$('#insertPaymentForm .third_party_cheque_table [name="new_amount"]').live('blur',function(){
			$('#insertPaymentForm [name="paid_amount"]').trigger('blur');
		});
		
		
		$("#insertPaymentForm").validate({
			submitHandler: function(form) {
				var tForm = $("#insertPaymentForm");
				$('[name="paid_amount"]',tForm).trigger('blur');
				var payment_type	=	parseInt($(' [name="payment_type"]',tForm).val());
				var client_id	=	$(' [name="client_id"]',tForm).val();
				
				var previous_balance	=	parseFloat($(' [name="previous_balance"]',tForm).val());
				var paid_amount			=	parseFloat($(' [name="paid_amount"]',tForm).val());
				if(previous_balance < paid_amount){
					showmsg("Importe mayor al adeudado. Por favor, ingrese un importe igual o menor al saldo pendiente.!",'f');
					return false;					
				}
				
				switch(payment_type){
					case 1:
						var url = '/index/savepaymentforrejectedchequeajax';
						$.post(url, { 
										'client_id' 		: client_id,
										'operation_id'		: $(' [name="operation_id"]',tForm).val(),
										'cheque_id'			: $(' [name="rejected_cheques"] option:selected',tForm).val(),
										'date_paid'			: currentDate,
										'paid_amount'		: $(' [name="paid_amount"]',tForm).val(),
							     		'previous_balance'	: $(' [name="previous_balance"]',tForm).val(),
							     		'current_balance'	: $(' [name="current_balance"]',tForm).val(),
							     		'payment_type'		: $(' [name="payment_type"]',tForm).val(),
									},
									function(data){							
										if(isInt(data)){
										var seltr = $('#userid_'+client_id);
										$('.amBtn',seltr).trigger('click', [true]);
										$( "#insertPayment" ).dialog('close');
										showmsg("Adding payment is done successfully!",'t');
										clearForm(tForm);
										if(parseInt($('.rejected_cheques_payment [name="rcp_status"]').val())){							
											$('#grid #userid_'+client_id).next('tr').find('.addNewGdc').trigger('click');
										}
										}else{
											showmsg("Adding payment is failed Please try again!",'f');
										}							
						});
					break;	
					case 2:
						var url = '/index/saveownchequeforrejectedchequeajax';
						$.post(url, { 
										'client_id' 		: client_id,
										'operation_id'		: $(' [name="operation_id"]',tForm).val(),
										'cheque_id'			: $(' [name="rejected_cheques"] option:selected',tForm).val(),
										'date_paid'			: currentDate,
										'paid_amount'		: $(' [name="paid_amount"]',tForm).val(),
							     		'previous_balance'	: $(' [name="previous_balance"]',tForm).val(),
							     		'current_balance'	: $(' [name="current_balance"]',tForm).val(),
							     		'payment_type'		: $(' [name="payment_type"]',tForm).val(),
							     		
							     		'cheque_date'		: $('.own_cheque_table [name="date"]',tForm).val(),
							     		'new_cheque_n'		: $('.own_cheque_table [name="check_n"]',tForm).val(),
							     		'rejected_bank_id'	: $('.own_cheque_table [name="bank_account_id"]',tForm).val(),
									},
									function(data){							
										if(isInt(data)){
											var seltr = $('#userid_'+client_id);
											$('.amBtn',seltr).trigger('click', [true]);
											$( "#insertPayment" ).dialog('close');
											showmsg("Adding payment is done successfully!",'t');
											clearForm(tForm);
											if(parseInt($('.rejected_cheques_payment [name="rcp_status"]').val())){							
												$('#grid #userid_'+client_id).next('tr').find('.addNewGdc').trigger('click');
											}
										}else{
											showmsg("Adding payment is failed Please try again!",'f');
										}							
						});
					break;
					case 3:
						var url = '/index/savechequewithbankforrejectedchequeajax';
						$.post(url, { 
										'client_id' 		: client_id,
										'operation_id'		: $(' [name="operation_id"]',tForm).val(),
										'cheque_id'			: $(' [name="rejected_cheques"] option:selected',tForm).val(),
										'date_paid'			: currentDate,
										'paid_amount'		: $(' [name="paid_amount"]',tForm).val(),
							     		'previous_balance'	: $(' [name="previous_balance"]',tForm).val(),
							     		'current_balance'	: $(' [name="current_balance"]',tForm).val(),
							     		'payment_type'		: $(' [name="payment_type"]',tForm).val(),
							     		
							     		'cheque_date'		: $('.third_party_cheque_table [name="new_date"]',tForm).val(),
							     		'new_cheque_n'		: $('.third_party_cheque_table [name="new_check_n"]',tForm).val(),
							     		
							     		
							     		'bank_name'			: $('.third_party_cheque_table [name="bank_name"]',tForm).val(),
							     		'branch'			: $('.third_party_cheque_table [name="branch"]',tForm).val(),
							     		'account_n'			: $('.third_party_cheque_table [name="account_n"]',tForm).val(),
							     		'opening_date'		: $('.third_party_cheque_table [name="opening_date"]',tForm).val(),
							     		'check_zip_code'	: $('.third_party_cheque_table [name="new_check_zip_code"]',tForm).val(),
							     		'location_capital'	: $('.third_party_cheque_table [name="location_capital"]:checked',tForm).val(),
									},
									function(data){							
										if(isInt(data)){
											var seltr = $('#userid_'+client_id);
											$('.amBtn',seltr).trigger('click', [true]);
											$( "#insertPayment" ).dialog('close');
											showmsg("Adding payment is done successfully!",'t');
											clearForm(tForm);											
											if(parseInt($('.rejected_cheques_payment [name="rcp_status"]').val())){							
												$('#grid #userid_'+client_id).next('tr').find('.addNewGdc').trigger('click');
											}
										}else{
											showmsg("Adding payment is failed Please try again!",'f');
										}							
						});
				   break;
					
				}
				
				
			}
		});
		$('.addNewGdc').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			$('.rejected_cheques_payment').dialog('open');
			$('.dataLoading').show();
			var bankDetailsTable	=	$(this).parents('.fnOpenTable:eq(0)');
			var clientid = $(this).attr('id').split('_');
			$('.rejected_cheques_payment [name="client_id"]').val(clientid[1]);
			var url = '/index/getgestiondetailsajax';
			gtTable.fnClearTable();
			gptTable.fnClearTable();
			$.post(url, { 
				"client_id" 	: clientid[1]
				},
				function(data){
					if(data){
						
						var item,check_n,amount,id,bank_name,balance,operation_id,date,rejected_gastos,total,observations,option = '';
						gtTable.fnClearTable();
						var grcList	=	data['grcList'];
						var gccList	=	data['gccList'];
						for(var x in grcList){
							item			=	grcList[x];
							check_n			=	item['check_n'];
							id				=	item['id'];
							bank_name		=	item['bank_name'];
							balance			=	item['balance'];
							operation_id	=	item['operation_id'];
							date			=	item['date'];
							amount			=	parseFloat(item['amount']);
							rejected_gastos	=	item['rejected_gastos']?parseFloat(item['rejected_gastos']):0.00;
							total			= 	amount + rejected_gastos; 
							observations	=	item['observations'];
							var trmade = $('#gestionTable').dataTable().fnAddData( [							                                                
													                               		date,
													                               		amount,
													                               		rejected_gastos,
													                               		total.toFixed(2),
													                               		balance,
													                               		check_n,
													                               		bank_name,
													                               		observations,
													                               		] );
						}
						for(var x in gccList){
							item				=	gccList[x];
							id					=	item['id'];
							date_paid			=	item['date_paid'];
							previous_balance	=	item['previous_balance'];
							check_n				=	item['check_n'];
							paid_amount			=	item['paid_amount'];
							current_balance		=	item['current_balance'];
							amount			=	parseFloat(item['amount']);
							rejected_gastos	=	parseFloat(item['rejected_gastos']);
							total			= 	amount + rejected_gastos; 
							observations	=	item['observations'];
							var trmade = $('#gestionPagoTable').dataTable().fnAddData( [							                                                
													                               		date_paid,
													                               		paid_amount,
													                               		check_n,
													                               		previous_balance,
													                               		current_balance,
													                               		] );
						}
						
					}else{
						$('.dataLoading').hide();
						gtTable.fnClearTable();
						gptTable.fnClearTable();	
						
					}
					$('.dataLoading').hide();
				
			},'json').error(function() { 
				$('.dataLoading').hide();
				
				showmsg("El cliente no posee cheques rechazados.",'f');
				return false;
			});
			$('.btnLoading',this).hide();
		});
		$('.operationStepTwo').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var url = '/index/operationsteptwoajax';
			var operationid	=	$('[name="operationid"]',this).val();
			var clientid = $(this).attr('id').split('_');
			$.post(url, { 
							"operation_id" 	: operationid
						},
						function(data){	
							var seltr = $('#userid_'+clientid[1]);
							$('.amBtn',seltr).trigger('click', [true]);
							/*if(isInt(data)){
								showmsg("Adding Operaciones done successfully!",'t');
								$( "#newOperations" ).dialog('close');
								clearForm(tForm);
							}else{
								showmsg("Oops Adding Operaciones done not successfully!",'f');
							}*/							
			});			
		});
		
		$('#PlansDrp').change(function(){
			var pqty	=	parseFloat($('option:selected',this).attr('pqty'));
			var prec	=	parseFloat($('option:selected',this).attr('prec'));
			var plansList = '';
			var interest 		=	parseFloat($('#InterestDrp option:selected').attr('interestvalue'));
			var amount 		=	parseFloat($('#Plans .pAmount').val());
			var	interestAmount	=	((interest*amount)/100)+amount;	
			var divAmount	=	parseFloat(Math.round(interestAmount/pqty)).toFixed(2);
			//recDate(currentDate,prec);
			if(!interest){
				showmsg("Please Select the Interest!",'f');
				$('#PlansDrp option[value=""]').attr('selected','selected');
				plansList	=	'';
				$('.plansListUL').html(plansList);
				return false;
			}
			if(!amount){
				showmsg("Please Enter the Amount!",'f');
				$('#PlansDrp option[value=""]').attr('selected','selected');
				plansList	=	'';
				$('.plansListUL').html(plansList);
				return false;
			}
			var insertDate	=	currentDate;
			for(var i = 1; i <= pqty; i++){
				var newDate =	recDate(insertDate,prec);
				plansList	+=	'<li>Cheque '+i+' : <input type="text" class="datepicker changeDateSpan" size="16"  value="'+newDate+'" /> ';
				plansList	+=	' <span class="dollar">$</span> <span class="changeAmountSpan">'+divAmount+'</span> </li>';
				insertDate =	newDate;
			}
			$('.plansListUL').html(plansList);
			datepicker();
		});
		$('#InterestDrp').change(function(){
			$('#PlansDrp').trigger('change');
		});
		$('.pAmount').blur(function(){
			$('#PlansDrp').trigger('change');
		});
		$('#PlansEditDrp').change(function(){
			var pqty	=	parseFloat($('option:selected',this).attr('pqty'));
			var prec	=	parseFloat($('option:selected',this).attr('prec'));
			var plansList = '';
			var amount =	parseFloat(Math.round($('#PlansEdit .pAmount')).text());
			var divAmount	=	amount/pqty;
			
			for(var i = 1; i <= pqty; i++){
				plansList	+=	'<li>Cheque '+i+' : <span class="changeDateSpan">'+currentDate+'</span><span class="calBtn"> </span> ';
				plansList	+=	' [<span class="dollar">$</span> <span class="changeAmountSpan">'+divAmount+'</span><span class="calndBtn"> </span> ]</li>';
			}
			$('.plansEditListUL').html(plansList);
		});
		var pd = 1;
		$('.calBtn').live('click',function(){
		
		});
		$('.calndBtn').live('click',function(){
		
		});
		$('.cheque_nBtn').live('click',function(){
			
		});
		$('.operationStepThree').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var url = '/index/operationstepthreeajax';
			var operationid	=	$('[name="operationid"]',this).val();
			var clientid = $(this).attr('id').split('_');
			$.post(url, { 
							"operation_id" 	: operationid
						},
						function(data){	
							var seltr = $('#userid_'+clientid[1]);
							$('.amBtn',seltr).trigger('click', [true]);											
			});
		});
		$('.operationStepFour').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var clientid = $(this).attr('id').split('_');
			var tform = $('#plansForm');
			sForm	=	$('#plansForm');
			clearForm(sForm);
			$('[name="client_id"]',tform).val(clientid[1]);
			//$('.pFirst_name',tform).text($('#userid_'+clientid[1]+' .user_first_name').text());
			//$('.pLast_name',tform).text($('#userid_'+clientid[1]+' .user_last_name').text());
			$('.pAmount',tform).val($('[name="amount"]',this).val());
			$('.current_date',tform).text(currentDate);
			if(!$('.pAmount',tform).parent('td').has('.dollar').length){
				$('.pAmount',tform).before('<span class="dollar">$</span> ');
			}
			$('.plansListUL',tform).html('');
			$( "#Plans" ).dialog('open');
			
			$('[name="operation_id"]',tform).val($('[name="operationid"]',this).val());
			$('.btnLoading').hide();
		});
		$('.operationStepFive').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var url = '/index/operationstepfiveajax';
			var operationid	=	$('[name="operationid"]',this).val();
			var clientid = $(this).attr('id').split('_');
			$.post(url, { 
							"operation_id" 	: operationid
						},
						function(data){	
							var seltr = $('#userid_'+clientid[1]);
							$('.amBtn',seltr).trigger('click', [true]);												
			});
		});
		$('.operationStepSix').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var clientid = $(this).attr('id').split('_');
			var tform = $('#plansEditForm');
			var cave_id	=	parseInt($('[name="cave_id"]',this).val());
			var state_id	=	parseInt($('[name="state_id"]',this).val());
			var showChequeFields	=	true;
			var default_checkbox	=	true;
			if(!cave_id){
				$('.localTr',tform).hide();
			}else{
				$('.localTr',tform).show();
			}
			if(state_id	== 5 && cave_id	==	1){
				$('[name="show_cheques"]',this).val(0);
				$('.plansEditListUL').attr('show_cheques',0);
				showChequeFields	=	false;
				default_checkbox	=	false;
				state_id			=	6;
			}else{
				state_id	=	14;
				$('[name="show_cheques"]',this).val(1);
				$('.plansEditListUL').attr('show_cheques',1);
			}
			sForm	=	tform;
			clearForm(sForm);
			$('.plansEditListUL').html('<li><b>Loading...</b></li>');
			
			
			var url = '/index/getchecksbyoperationidajax';
			var operationid	=	$('[name="operationid"]',this).val();
			$.post(url, { 
							"operation_id" 	: operationid
						},
						function(data){	
							var plan_id			=	data['planid'];
							var interests_id	=	data['interests_id'];
							var cheques			=	data['cheques'];
							var localChk,cheque,amount,plansList,x,chkDis,chkDisCls;
							if(parseInt(plan_id)){
								$('[name="plans"] option[value="'+plan_id+'"]',tform).attr('selected','selected');
							}else{
								$('[name="plans"] option[value=""]',tform).attr('selected','selected');
							}
							if(parseInt(interests_id)){
								$('[name="interests_id"] option[value="'+interests_id+'"]',tform).attr('selected','selected');
							}else{
								$('[name="interests_id"] option[value=""]',tform).attr('selected','selected');
							}
							
							if(cheques){
								var pqty	=	parseFloat($('option:selected',tform).attr('pqty'));
								var prec	=	parseFloat($('option:selected',tform).attr('prec'));
								plansList = '';
								x = 1;
								amount	=	0.00;
								var kar=1;
								for(var i in cheques){
									cheque	=	cheques[i];
									amount	=	parseFloat(cheque['amount']).toFixed(2);
									check_n	=	cheque['check_n'];
									localChk	=	'';
									if(parseInt(cheque['local']) && default_checkbox){
										localChk	=	'checked="checked" ';
										chkDis		=	'';
										chkDisCls	=	'';
										kar++;
										cTIndex		=	'tabindex="'+kar+'"';
										kar++;
										dTIndex		=	'tabindex="'+kar+'"';
										
									}else if(cave_id){
										localChk	=	'';
										chkDis		=	' disabled="disabled"';
										chkDisCls	=	'disabledCls';
										dTIndex		=	'';
										cTIndex		=	'';
									}
									if(!check_n){
										check_n	=	'';
									}
									plansList	+=	'<li id="chequeid_'+cheque['id']+'">';
									if(showChequeFields){
										plansList	+=	'Cheque '+x+' : <input class="changeCheque_nSpan '+chkDisCls+'" size="25" '+cTIndex+' value="'+check_n+'" "'+chkDis+'"/>  -  ';										
									}
									plansList	+=	'<input class="changeDateSpan datepicker" '+dTIndex+' size="16" value="'+cheque['date']+'"/> ';
									plansList	+=	' <span class="dollar">$</span> <span class="changeAmountSpan">'+amount+'</span>';
									if(cave_id){
										plansList	+=	'<input type="checkbox" name="local" class="localChk" '+localChk+'/></li>';
									}
									x++;
								}
								$('.plansEditListUL').html(plansList);
								$('.plansEditListUL').attr({'cave':cave_id});
								 
								$('.plansEditListUL').attr('state_id',state_id);
								datepicker();
								if($('.plansEditListUL li [name="local"]:checked').size()){
									if($('.plansEditListUL li [name="local"]:eq(0)').is(':checked')){
										$('#plansEditForm #local_2').attr('checked','checked');
									}else{
										$('#plansEditForm #local_1').attr('checked','checked');
									}
								}
							}										
			},'json');
			$('.localChk').live('click',function(){
				var localLi	=	$(this).parents('li:eq(0)');
				if($(this).is(':checked')){
					$('.changeCheque_nSpan',localLi).removeAttr('disabled').removeClass('disabledCls').focus();
					//$('[name="check_zip_code"]',localLi).removeAttr('disabled').removeClass('disabledCls').focus();
				}else{
					$('.changeCheque_nSpan',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('');
					//$('[name="check_zip_code"]',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('');
				}
			});
			$('.changeCheque_nSpan').live('focus',function(){
				if($(this).val()	==	''){
					$(this).val('');
				}
				if($.trim($(this).val())	==	''){
					$(this).val('');
				}
			});
			$('.changeCheque_nSpan').live('blur',function(){
				if($(this).val()	==	''){
					$(this).val('');
				}
			});
			$('.localDrp').change(function(){
				var check=uncheck	=	'';
				if(parseInt($(this).val())){
					check	=	'odd';
					uncheck	=	'even';
				}else{
					check	=	'even';
					uncheck	=	'odd';
				}
				$('.plansEditListUL li [name="local"]:'+check).attr('checked','checked');
				$('.plansEditListUL li [name="local"]:'+uncheck).removeAttr('checked');
				
				var localLi	, kar =	1;
				$('.plansEditListUL li [name="local"]').each(function(){
					localLi	=	$(this).parents('li:eq(0)');
					if($(this).is(':checked')){
						$('.changeCheque_nSpan',localLi).removeAttr('disabled').removeClass('disabledCls').attr({'tabindex':kar++});
						$('.changeDateSpan',localLi).attr({'tabindex':kar++});
						
						//$('[name="check_zip_code"]',localLi).removeAttr('disabled').removeClass('disabledCls').focus();
					}else{
						$('.changeCheque_nSpan',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('').removeAttr('tabindex');
						$('.changeDateSpan',localLi).removeAttr('tabindex');
						//$('[name="check_zip_code"]',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('');
					}
				});
				
			});
			$('[name="client_id"]',tform).val(clientid[1]);
			//$('.pFirst_name',tform).text($('#userid_'+clientid[1]+' .user_first_name').text());
			//$('.pLast_name',tform).text($('#userid_'+clientid[1]+' .user_last_name').text());
			$('.pAmount',tform).text($('[name="amount"]',this).val());
			$('.current_date',tform).text(currentDate);
			if(!$('.pAmount',tform).parent('td').has('.dollar').length){
				$('.pAmount',tform).before('<span class="dollar">$</span> ');
			}
			$('[name="operation_id"]',tform).val($('[name="operationid"]',this).val());
			$( "#PlansEdit" ).dialog('open');
			
		});
		
		$("#operationsForm").validate({
			submitHandler: function(form) {
				var tForm = $("#operationsForm");
				var url = tForm.attr('action');
				$.post(url, { 
								"client_id" 		: $(' [name="client_id"]',tForm).val(),
								"date"  			: $(' [name="date"]',tForm).val(),
								"amount" 	 		: $(' [name="amount"]',tForm).val(),
								"state"  			: 1,
								"observations" 		: $(' [name="observations"]',tForm).val(),
								"report" 			: $(' [name="report"]',tForm).val(),
								"cave" 				: $(' [name="cave"]',tForm).val(),
								"bank_account_id"	: $(' [name="bank_account_id"]',tForm).val(),
							},
							function(data){							
								if(isInt(data)){
									var seltr = $('#userid_'+$(' [name="client_id"]',tForm).val());
									$('.amBtn',seltr).trigger('click', [true]);
									showmsg("Adding Operaciones done successfully!",'t');
									
									$( "#newOperations" ).dialog('close');
									clearForm(tForm);
								}else{
									showmsg("Oops Adding Operaciones done not successfully!",'f');
								}							
							});
			}
		});
		$("#EditPriorClientForm").validate({
			submitHandler: function(form) {
				var tForm = $("#EditPriorClientForm");
				var url =	'/index/userpriorformajax';;
					var id						=	$("[name='id']",tForm).val();
					var client_id				=	$("[name='client_id']",tForm).val();
					var date					=	$("[name='date']",tForm).val();
					var is_operation_completed	=	$("[name*='is_operation_completed']:checked",tForm).val();
					var cave_name				=	$("[name='cave_name']",tForm).val();
					var cave_name_db			=	$("[name='cave_name'] option:selected",tForm).text();
					var amount					=	$("[name='amount']",tForm).val();
					var next_check_date			=	$("[name='next_check_date']",tForm).val();
					var pending_checks			=	$("[name='pending_checks']",tForm).val();
					var is_last_operation		=	$("[name='is_last_operation']",tForm).is(':checked')?1:0;
				$.post(url, { 
									'id'						:	id,
									'client_id'					:	client_id,
									'date'						:	date,
									'is_operation_completed'	:	is_operation_completed,
									'cave_name'					:	cave_name,
									'cave_name_db'				:	cave_name_db,
									'amount'					:	amount,
									'next_check_date'			:	next_check_date,
									'pending_checks'			:	pending_checks,
									'is_last_operation'			:	is_last_operation,
							},
							function(data){							
								if(isInt(data)){
									var seltr = $('#userid_'+$(' [name="client_id"]',tForm).val());
									$('.amBtn',seltr).trigger('click', [true]);
									showmsg("Adding Operaciones done successfully!",'t');
									
									$( ".EditPriorFromClientPanel" ).dialog('close');
									clearForm(tForm);
								}else{
									showmsg("Oops Adding Operaciones done not successfully!",'f');
								}							
							});
			}
		});
		$("#plansForm").validate({
			submitHandler: function(form) {
				var tForm = $("#plansForm");
				var url = '/index/operationstepfourajax/';
				var chequesList	=	new Array();
				var totalAmount	=	$('#Plans .pAmount').val();
				$('.amInp').blur();
				$('.pDateInp').blur();
				$('.plansListUL li',tForm).each(function(){
					var cheque	=	{
										'date'		:	$('.changeDateSpan',this).val(),
										'amount'	:	$('.changeAmountSpan',this).text()							
									}
					chequesList.push(cheque);
				});
				$.post(url, { 
								"total_amount"	:	totalAmount,
								"operation_id" 	: $('[name="operation_id"]',tForm).val(),
								"cheques_list"  : JSON.stringify(chequesList),
								"plan_id"		:	$('[name="plans"]',tForm).val(),
								'interests_id'	:	$('#InterestDrp option:selected',tForm).val(),
							},
							function(data){							
								if(isInt(data)){
									var seltr = $('#userid_'+$(' [name="client_id"]',tForm).val());
									$('.amBtn',seltr).trigger('click', [true]);
									
									showmsg("Adding Plans done successfully!",'t');
									$( "#Plans" ).dialog('close');
									clearForm(tForm);
								}else{
									showmsg("Oops Adding Plans done not successfully!",'f');
								}							
				});
			}
		});
		$("#plansEditForm").validate({
			submitHandler: function(form) {
				var tForm = $("#plansEditForm");
				var url = '/index/editplansandchequeaja/';
				var chequesList	=	new Array();
				var totalAmount	=	$('#PlansEdit .pAmount').text();
				$('.amInp').blur();
				$('.pDateInp').blur();
				$('.cnInp').blur();
				var state_id	=	$('.plansEditListUL').attr('state_id');	
				var submitFlag	=	true;
				var cave_id	=	parseInt($('.plansEditListUL').attr('cave'));
				var show_cheques	=	parseInt($('.plansEditListUL').attr('show_cheques'));
				var chkInp,local;
				var chkArr	=	new Array();
				
				$('.plansEditListUL li',tForm).each(function(){
					chkInp	=	$('.changeCheque_nSpan',this);
					local	=	$('[name="local"]',this).is(':checked')?1:0;
					var repeatedChk	=	searchItemArr(chkArr,chkInp.val());
					chkArr.push(chkInp.val());
					if($.trim(chkInp.val()) == '' && !local){
						if(cave_id && !local){
							return true;
						}else{
							chkInp.removeClass('inpError');
						}
						chkInp.addClass('inpError');
						submitFlag	=	false;
					}else if(repeatedChk && show_cheques){
						chkInp.addClass('inpError');
						submitFlag	=	false;
						showmsg("Cheque number should not repeat!",'f');
					}else{
						chkInp.removeClass('inpError');
					}	
					
				});
				if(!submitFlag){
					return false;
				}
				
				$('.plansEditListUL li',tForm).each(function(){
					var chequeid	=	$(this).attr('id').split('_');
					chequeid	=	chequeid[1]?chequeid[1]:null;
					cheque_n	=	null;
					if($('.changeCheque_nSpan',this).val() != ''){
						cheque_n	=	$('.changeCheque_nSpan',this).val();
					}
					
					var cheque	=	{	
										'id'				:	chequeid,
										'date'				:	$('.changeDateSpan',this).val(),
										'amount'			:	$('.changeAmountSpan',this).text(),
										'check_n'			:	cheque_n,
										'check_zip_code'	:	$('[name="check_zip_code"]',this).val(),										
									}
					if(cave_id){
						cheque['local'] 	=	$('[name="local"]',this).is(':checked')?1:0;						
					}else{
						cheque['local'] 	=	1;
					}					
					chequesList.push(cheque);
				});
				$.post(url, { 
								"total_amount"	:	totalAmount,
								"operation_id" 	: $('[name="operation_id"]',tForm).val(),
								"cheques_list"  : JSON.stringify(chequesList),
								"plan_id"		: $('[name="plans"]',tForm).val(),
								'state_id'		:	state_id
							},
							function(data){							
								if(isInt(data)){
									var seltr = $('#userid_'+$(' [name="client_id"]',tForm).val());
									$('.amBtn',seltr).trigger('click', [true]);
									
									showmsg("Adding Plans done successfully!",'t');
									$( "#PlansEdit" ).dialog('close');
									clearForm(tForm);
								}else{
									showmsg("Oops Adding Plans done not successfully!",'f');
								}							
				});
			}
		});
		
		oTable = $('#grid').dataTable({
			"bJQueryUI"			:	true,
			"sPaginationType"	:	"full_numbers",
			"sScrollXInner"		: "100%",			
			"bScrollCollapse"	:	true,
			"bStateSave"		:	true,
			"iDisplayLength"	: 50,
			"sScrollX"			: "100%",

		});
		oTable.fnSetColumnVis( 2, false );
		oTable.fnSetColumnVis( 13, false );
		oTable.fnSetColumnVis( 15, false );
		oTable.fnSetColumnVis( 16, false );
		oTable.fnSetColumnVis( 17, false );
		oTable.fnSetColumnVis( 18, false );
		
		gptTable = $('#gestionPagoTable').dataTable({
			"bJQueryUI": true,
			"bInfo": false,
			"bPaginate"			: false,	
			"bScrollCollapse"	: true,
			"bStateSave"		: true,
			'aoColumns'			: [ { "sType": 'us_date' }, null, null, null, null, ]
		});
		gtTable = $('#gestionTable').dataTable({
			"bJQueryUI": true,
			"bInfo": false,
			"bPaginate"	: false,	
			"bScrollCollapse"	: true,
			"bStateSave"		: true,
			'aoColumns': [ { "sType": 'us_date'}, null, null, null, null, null, null,null,]
		});
		$('.rejectChequeBtn').live('click',function(){
			tooltipBox = getToolTipForm($(this));
			var sTr	=	$(this).parents('tr').eq(0);
			var saleid =	sTr.attr('id').split('_');
			$('[name="cheque_id"]',tooltipBox).val(saleid[1]);
			
		});
		$('.costOne').live('click',function(){
			var url = '/index/rejectchequewithgastosajax';
			var tooltipBox	=	$('.tooltipBox');
			var cheque_id	=	$('[name="cheque_id"]',tooltipBox).val();
			var bankTr	=	$('#chequelistid_'+cheque_id);
			
			var gastos_denuncia	=	parseFloat($('[name="gastos_denuncia"]',tooltipBox).val());
			var chk_amount		=	parseFloat($('[class="td_amount"]',bankTr).text());
			var balance	=	gastos_denuncia	+	chk_amount;
			$.post(url, { 
				'id'				:	cheque_id,
				'gastos'			:	gastos_denuncia,
				'gastos_type'		:	$(this).val(),
			},
			function(data){						
				 if(data){
					 	showmsg('Cheque rejected Successfully!','t');
					 	$('.td_status_name',bankTr).text('Rechazado');
					 	$('.td_rej_balance',bankTr).text(balance.toFixed(2));
					 	$('.td_actions',bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
					 	bankTr.addClass('lightRedTr');
					 	tooltipBox.hide();
				 }else{
					 	showmsg('Oops Cheque rejection is not Successfully!','f');
				 }
			});
		});
		$('.costTwo').live('click',function(){
			var url = '/index/rejectchequewithgastosajax';
			var tooltipBox	=	$('.tooltipBox');
			var cheque_id	=	$('[name="cheque_id"]',tooltipBox).val();
			var bankTr	=	$('#chequelistid_'+cheque_id);
			var gastos_rechazo	=	parseFloat($('[name="gastos_rechazo"]',tooltipBox).val());
			var chk_amount		=	parseFloat($('[class="td_amount"]',bankTr).text());
			var balance	=	gastos_rechazo	+	chk_amount;
			$.post(url, { 
				'id'				:	cheque_id,
				'gastos'			:	gastos_rechazo,
				'gastos_type'		:	$(this).val(),
			},
			function(data){						
				 if(data){
					 	showmsg('Cheque rejected Successfully!','t');
					 	$('.td_status_name',bankTr).text('Rechazado');
					 	$('.td_rej_balance',bankTr).text(balance.toFixed(2));
					 	$('.td_actions',bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
					 	bankTr.addClass('lightRedTr');
					 	tooltipBox.hide();
				 }else{
					 	showmsg('Oops Cheque rejection is not Successfully!','f');
				 }
			});
		});
		$('.payedChequeBtn').live('click',function(){
			$(this).append('<div class="btnLoading"></div>');
			var bankTr = $(this).parents('tr:eq(0)');
			var bankid = bankTr.attr('id').split('_');
			var url = '/index/chequepayedajax';
			$.post(url, { 
				'id'				:	bankid[1]
			},
			function(data){						
				 if(data){
					 	showmsg('Cheque Payed Successfully!','t');
					 	$('.td_status_name',bankTr).text('Acreditado');
					 	$('.td_actions',bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
				 }else{
					 	showmsg('Oops Cheque Payed is not Successfully!','f');
				 }
			});
		});
		var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
		edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
		$("#grid_length").append(edBtn);
		$("#grid tbody").click(function(event) {
			$(oTable.fnSettings().aoData).each(function (){
				$(this.nTr).removeClass('row_selected');
			});
			$(event.target.parentNode).addClass('row_selected');
		});
		$('.deleteBtn').click( function() {
			
			deleteFun(oTable);
		} );
		function deleteFun(oTable){
			var result = confirm('Do you wont to delete!');
			
			if(result){
				var anSelected = fnGetSelected( oTable );
				var selIdArr = anSelected[0].id.split("_");
				var url = "/gyuser/Index/userdeleteajax";
				$.post(url, { 
						"id"   : selIdArr[1]
						},				
						 function(data){
						 if(isInt(data)){
							 showmsg('Successfully deleted!','t');	
							 oTable.fnDeleteRow( anSelected[0] );							  
						 }else{		
							 showmsg('Oops user not deleted. May be operations are pending!','f');
						 }
				});
			}
		}
		function fnGetSelected( oTableLocal )
		{
			var aReturn = new Array();
			var aTrs = oTableLocal.fnGetNodes();
			
			for ( var i=0 ; i<aTrs.length ; i++ )
			{
				if ( $(aTrs[i]).hasClass('row_selected') )
				{
					aReturn.push( aTrs[i] );
				}
			}
			return aReturn;
		}
		$( ".editBtn" )
		.click(function() {
			var selRow = $(".gridtbody .row_selected");
			
			if(selRow.size()){
				var idArr = selRow.attr('id').split("_");
				var popEditForm = $("#userFormPop");				
				$('[name="id"]',popEditForm).val(idArr[1]);
				$('[name="client_type"] option[value="'+$("[name='ct_id']",selRow).val()+'"]',popEditForm).attr('selected','selected');
				$('[name="operator"] option[value="'+$(".user_operator input",selRow).val()+'"]',popEditForm).attr('selected','selected');
				$('[name="first_name"]',popEditForm).val($(".user_first_name",selRow).text());
				$('[name="last_name"]',popEditForm).val($(".user_last_name",selRow).text());
				$('[name="DNI"]',popEditForm).val($(".user_DNI",selRow).text());
				$('[name="CUIL"]',popEditForm).val($(".user_CUIL",selRow).text());
				$('[name="business"]',popEditForm).val($(".user_business",selRow).text());
				$('[name="business_CUIT"]',popEditForm).val($(".user_business_CUIT",selRow).text());
				$('[name="tel_part"]',popEditForm).val($(".user_tel_part .number_inp",selRow).text());
				$('[name="tel_lab"]',popEditForm).val($(".user_tel_lab .number_inp",selRow).text());
				$('[name="tel_cell"]',popEditForm).val($(".user_tel_cell .number_inp",selRow).text());
				$('[name="tel_otro"]',popEditForm).val($(".user_tel_otro .number_inp",selRow).text());
				$('[name="tel_part_code"]',popEditForm).val($(".user_tel_part .area_code_inp",selRow).text());
				$('[name="tel_lab_code"]',popEditForm).val($(".user_tel_lab .area_code_inp",selRow).text());
				$('[name="tel_cell_code"]',popEditForm).val($(".user_tel_cell .area_code_inp",selRow).text());
				$('[name="tel_otro_code"]',popEditForm).val($(".user_tel_otro .area_code_inp",selRow).text());
				$('[name="email"]',popEditForm).val($(".user_email",selRow).text());
				$('[name="activity"]',popEditForm).html($(".user_activity",selRow).text());
				$('[name="date_added"]',popEditForm).val($(".user_date_added",selRow).text());
				$('[name="contact_point"] option[value="'+$("[name='contact_id']",selRow).val()+'"]',popEditForm).attr('selected','selected');
				$('[name="extra_info"]',popEditForm).val($(".user_extra_info",selRow).text());
			
				var client_type_text = $('[name="client_type"] option[value="'+$(".user_client_type input",selRow).val()+'"]',popEditForm).text();
				if(client_type_text.toLowerCase() == 'potencial con operaciones'){
					$("#EditPriorTr").show();
					$('#showPriorDiv').html('Loading Operaciones Anteriores...');
					var url = "/index/getpriorbyclientidajax";
					$.post(url, { 
						"client_id" : idArr[1]
					},function(data){
						$('#showPriorDiv').html('');
						if(data && data != ''){	
						 	for(var x in data){
								var jsonData = data[x];
								var addNewSpan = CreatePriorOperationsView(jsonData);
								$("#showPriorDiv").append(addNewSpan);
							}						
						}						
					},'json');
				}else{
					$("#EditPriorTr").hide();
					$("#showPriorDiv").hide();
				}
				if($('[name="client_type"]',popEditForm).val() == '1'){
					$('#userFormPop [name="CUIL"]').addClass('required');
				}else{
					$('#userFormPop [name="CUIL"]').removeClass('required');			
				}
				$('#showAddressDiv').html('Loading Domicilio');
				$( "#editPopUP" ).dialog("open");
				var url = "/index/getaddressbyclientidajax";
				$.post(url, { 
					"client_id" : idArr[1]
				},function(data){
					$('#showAddressDiv').html('');
					for(var x in data){
						var jsonData = data[x];
						if(jsonData){
							var newAddSpan = CreateShowAddressView(jsonData);
							$('#showAddressDiv').append(newAddSpan);
						}
					}					
				},'json');	
					
			}else{		
				showmsg("Please select the row!",'f');
			}
		});
		$( "#tabs" ).tabs({ selected: 0 });
		uForm = $("#userForm").validate({
				submitHandler: function(form) {
					var tForm = $("#userForm");
					var url = tForm.attr('action');
					$("#userForm").animate( { "opacity" : .2 }, 250 );
					var tel_cell_code 	= cellcode($('[name="tel_cell_code"]',tForm).val());
					var tel_otro_code 	= cellcode($('[name="tel_otro_code"]',tForm).val());
					var tel_part_code 	= $('[name="tel_part_code"]',tForm).val();
					var tel_lab_code 	= $('[name="tel_lab_code"]',tForm).val();
					var tel_cell	  	= cellnumber($('[name="tel_cell"]',tForm).val());
					var tel_otro		= cellnumber($('[name="tel_otro"]',tForm).val());					
					var tel_part	  	= landnumber($('[name="tel_part"]',tForm).val());
					var tel_lab			= landnumber($('[name="tel_lab"]',tForm).val());
					
					$.post(url, { 
									"client_type"   	: $('[name="client_type"]',tForm).val(),
									"operator"  		: $('[name="operator"]',tForm).val(),
									"first_name" 		: $('[name="first_name"]',tForm).val(),
									"last_name"   		: $('[name="last_name"]',tForm).val(),
									"DNI"  				: $('[name="DNI"]',tForm).val(),
									"CUIL" 				: $('[name="CUIL"]',tForm).val(),
									"business" 			: $('[name="business"]',tForm).val(),
									"business_CUIT" 	: $('[name="business_CUIT"]',tForm).val(),
									"tel_part"  		: tel_part,
									"tel_part_code" 	: tel_part_code,
									"tel_lab"  			: tel_lab,
									"tel_lab_code"		: tel_lab_code,
									"tel_cell"  		: tel_cell,
									"tel_cell_code"		: tel_cell_code,
									"tel_otro"  		: tel_otro,
									"tel_otro_code" 	: tel_otro_code,
									"email" 			: $('[name="email"]',tForm).val(),
									"activity"  		: $('[name="activity"]',tForm).val(),
									"date_added"  		: $('[name="date_added"]',tForm).val(),
									"contact_point" 	: $('[name="contact_point"]',tForm).val(),
									"extra_info"  		: $('[name="extra_info"]',tForm).val(),
									"user_type_id" 		: $('[name="user_type_id"]',tForm).val(),
									"multi_address_json": $('[name="multi_address_json"]',tForm).val(),	
									"multi_prior_json"	: $('[name="multi_prior_json"]',tForm).val()

								},
								
							 function(data){
									
							  if(isInt(data)){
								 $('#userBankForm input[name="user_id"]').val(data);
								 $('#userBankForm input[name="addType"]').val('add');
								 
								  $(".confirm-add-user").dialog('open'); 
								var trmade = $('#grid').dataTable().fnAddData( [
								                                    '<img src="/images/details_open.png" class="amBtn">',            
								                               		data,
								                               		$('[name="client_type"] option:selected',tForm).text(),
								                               		$('[name="first_name"]',tForm).val(),
								                               		$('[name="last_name"]',tForm).val(),
								                               		$('[name="date_added"]',tForm).val(),
								                               		$('[name="DNI"]',tForm).val(),
								                               		$('[name="CUIL"]',tForm).val(),
								                               		$('[name="business"]',tForm).val(),
								                               		$('[name="business_CUIT"]',tForm).val(),
								                               		CreateSpansForViewNumber($('[name="tel_part_code"]',tForm).val(),$('[name="tel_part"]',tForm).val()),
								                               		CreateSpansForViewNumber($('[name="tel_lab_code"]',tForm).val(),$('[name="tel_lab"]',tForm).val()),
								                               		CreateSpansForViewNumber($('[name="tel_cell_code"]',tForm).val(),$('[name="tel_cell"]',tForm).val()),
								                               		CreateSpansForViewNumber($('[name="tel_otro_code"]',tForm).val(),$('[name="tel_otro"]',tForm).val()),
								                               		$('[name="email"]',tForm).val(),
								                               		$('[name="activity"]',tForm).val(),
								                               		$('[name="contact_point"] option:selected').eq(0).text()+'<input type="hidden" name="contact_point_id" value="'+$('[name="contact_point"] option:selected').val()+'"/>',
								                               		$('[name="extra_info"]',tForm).val(),
								                               		$('[name="operator"] option:selected').eq(0).text()+'<input type="hidden" name="ct_id" value="'+$('[name="operator"] option:selected').val()+'"/>'
								                               		
								                               		] );
						var oSettings = oTable.fnSettings();
				 		var nTr = oSettings.aoData[ trmade[0] ].nTr;
								nTr.id = 'userid_'+data;
								$("td:eq(2)",nTr).addClass('user_client_type').append('<input type="hidden" name="ct_id" value="'+$('select[name="client_type"]',tForm).val()+'">');
								$("td:eq(3)",nTr).addClass('user_first_name');
								$("td:eq(4)",nTr).addClass('user_last_name');
								$("td:eq(5)",nTr).addClass('user_date_added');
								$("td:eq(6)",nTr).addClass('user_DNI');
								$("td:eq(7)",nTr).addClass('user_CUIL');
								$("td:eq(8)",nTr).addClass('user_business');
								$("td:eq(9)",nTr).addClass('user_business_CUIT');
								$("td:eq(10)",nTr).addClass('user_tel_part');
								$("td:eq(11)",nTr).addClass('user_tel_lab');
								$("td:eq(12)",nTr).addClass('user_tel_cell');
								$("td:eq(13)",nTr).addClass('user_tel_otro');
								$("td:eq(14)",nTr).addClass('user_email');								
								$("td:eq(15)",nTr).addClass('user_activity');
								$("td:eq(16)",nTr).addClass('user_contact_point');
								$("td:eq(17)",nTr).addClass('user_extra_info');
								$("td:eq(18)",nTr).addClass('user_operator');
								
								
								clearForm(tForm)
								clearForm($('#AddNewAddressForm'));
								$('#AddNewAddressForm .new_address_span').remove();
								$(".showAddressDivOnAdd",tForm).html('');
								clearForm($('#AddPriorForm'));
								$('#AddPriorForm .new_address_span').remove();
							 }else{
								 showmsg("Oops Adding client is not successfull!\n\n Try Again ",'f');								 
							 }
							  
							  //$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
							 
							  
					});
					$("#userForm").animate( { "opacity" : 1 }, 250 );
				}	
		});
		$( "input[name='dob']" ).addClass('datepicker');
		datepicker();
	    $('.edTabBtn').click(function(){
			$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
		});
		$("#userSubmit").click(function(){
			//return false;
		});
		$("#userFormPop input").addClass('text ui-widget-content ui-corner-all');
					
		
	});

$(function() {
	// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
	
	
	$( ".add-new-user" ).dialog({
		autoOpen: false,modal:true,
		
		
		buttons: {
			"Agregar": function() {		
				
				$( ".confirm-add-user" ).dialog('open');	
				$( this ).dialog( "close" );
					
			},
			"Cerrar": function() {
			
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			showmsg('Usuario cargado exitosamente...','t');
		}
    });
	$( ".confirm-add-user" ).dialog({
		autoOpen: false,modal:true,		
		height: 400,
		width: 500,		
		buttons: {
			"Guardar": function() {		
					$('#userBankForm').submit();
					
			},
			"Cancelar": function() {
				clearForm($("#userForm"));
				clearForm($("#userBankForm"));
				$( this ).dialog( "close" );
				showmsg('Cuenta cargada exitosamente...','t');
			}
		},
		close: function() {
			
		}
    });
	$( ".addAddressPop" ).dialog({
		autoOpen: false,modal:true,
		height: 600,
		width: 700,		
		buttons: {
			"Guardar": function() {
				AddNewAddressForm();
				$("#AddNewAddressForm").submit();
			},
			"Agregar Otro": function() {	
				$("#AddNewAddressForm [name='street']").validate();
				var newAddSpan = CreateAddressSpan();
				$('.address_main_div').append(newAddSpan);
				
				
		},
	
		},
		close: function() {
			$('#userForm [name="activity"]').focus();
		}
    });
	function AddNewAddressForm(){
	
		$("#AddNewAddressForm").validate({
			 debug: true,
			submitHandler: function(form) {
			var multiAddressJson	= []; 
			$('#AddNewAddressForm  .address_span').each(function(){
				
				var id					=	$("[name='id']",this).val();
				var street				=	$("[name='street']",this).val();
				var city				=	$("[name='city']",this).val();
				var zip_code			=	$("[name='zip_code']",this).val();
				var state_select		=	$(".state_select",this).val();
				var state_name			=	$(".state_select option:selected",this).text();
				var address_type		=	$("[name='address_type']",this).val();
				var delivery_address	=	$("[name='delivery_address']",this).is(':checked')?1:0;
				var AddressJosn = {
				                   		'id'				:	id,
										'street'			:	street,
				                   		'city'				:	city,
				                   		'zip_code'			:	zip_code,
				                   		'state_name'		:	state_name,
				                   		'state_select'		:	state_select,
				                   		'address_type'		:	address_type,
				                   		'delivery_address'	:	delivery_address,
									};
				
				multiAddressJson.push(AddressJosn);
			});
			//alert(JSON.stringify(mulitAddresJson));
			$("#userForm [name='multi_address_json']").val(JSON.stringify(multiAddressJson));
			if(multiAddressJson){
				$('.showAddressDivOnAdd').html('');
				for(var x in multiAddressJson){					
					var data = multiAddressJson[x];
					var newAddressView = CreateShowAddressView(data);
					$('.showAddressDivOnAdd').append(newAddressView);
				}
			}
			$( ".addAddressPop" ).dialog( "close" );
			return false;
		}			
	});
	}
	$("#EditAddressForm").validate({
		submitHandler: function(form) {
			var tForm = $('#EditAddressForm');
			var multiAddressJson	= []; 
			$('.address_span',tForm).each(function(){
				
				var id					=	$("[name='id']",this).val();
				var street				=	$("[name='street']",this).val();
				var city				=	$("[name='city']",this).val();
				var zip_code			=	$("[name='zip_code']",this).val();
				var state_select		=	$(".state_select",this).val();
				var address_type		=	$("[name='address_type']",this).val();
				var delivery_address	=	$("[name='delivery_address']",this).is(':checked')?1:0;
				var AddressJosn = {
				                   		'id'				:	id,
										'street'			:	street,
				                   		'city'				:	city,
				                   		'zip_code'			:	zip_code,
				                   		'state_select'		:	state_select,
				                   		'address_type'		:	address_type,
				                   		'delivery_address'	:	delivery_address,
									};
				
				multiAddressJson.push(AddressJosn);
			});
			//alert(JSON.stringify(mulitAddresJson));
			var multiAddressJson	=	JSON.stringify(multiAddressJson);
			var url =	"/index/editmultiaddressajax";
			var client_id = $("[name='client_id']",tForm).val();
			//alert(client_id);
			//alert(multiAddressJson);
			$.post(url, { 
				'client_id'				:	client_id,
				'multi_address_json'	:	multiAddressJson,	
			},
			
				 function(data){
						
				  if(data){
					  showmsg('Updating Address is Successfully!','t');	
					  var url = "/index/getaddressbyclientidajax";
						$.post(url, { 
							"client_id" : client_id
						},function(data){
							$('#showAddressDiv').html('');
							for(var x in data){
								var jsonData = data[x];
								if(jsonData){
									var newAddSpan = CreateShowAddressView(jsonData);
									$('#showAddressDiv').append(newAddSpan);
								}
							}					
						},'json');	
				 }else{
					 showmsg('Updating Address is not Successfully!','f');
				 }
			});	
			$( ".editAddressPop" ).dialog( "close" );
			return false;
		}
			
	});
	$('.deleteAddress').live('click',function(){
		
		var addressSpan = $(this).parents('.address_span');
		var addressId = parseInt($('[name="id"]',addressSpan).val());
		var url = "/index/deleteaddressajax";
		if(addressId){
			$.post(url, { 
				'address_id'				:	addressId
			},
			function(data){						
				 if(data){
					  addressSpan.remove();
					  showmsg('Address is Deleted Successfully!','t');		  
				 }else{
					 showmsg('Address is Deleted Not Successfully!','f');
				 }
			});	
		}else{
			addressSpan.remove();
			showmsg('Address is Deleted Successfully!','t');
		}
		
	})
	
	$("#userBankForm").validate({
		submitHandler: function(form) {
			userFormPop = $("#userBankForm");
			var url = userFormPop.attr('action');
			var userid = $('#userBankForm [name="user_id"]').val();
			
			$.post(url, { 
				"user_id"   		: userid,
				"bank_name"  		: $('[name="bank_name"]',userFormPop).val(),
				"account_n" 		: $('[name="account_n"]',userFormPop).val(),
				"branch"  			: $('[name="branch"]',userFormPop).val(),
				"opening_date"		: $('[name="opening_date"]',userFormPop).val(),
				"zip_code"			: $('[name="zip_code"]',userFormPop).val(),
				"location_capital"	: $('[name="location_capital"]:checked',userFormPop).val(),
			},
				function(data){
						
				  if(data){
					 
					  if($('#userBankForm input[name="addType"]').val() == 'listing'){
						  var seltr = $('#userid_'+userid);
						  $('.amBtn',seltr).trigger('click', [true]);
					  }
					  
					  $( ".confirm-add-user" ).dialog('close'); 
					  
					  
					  clearForm($("#userForm"));
					  clearForm($("#userBankForm"));
					  $( ".add-new-user" ).dialog('open');
				 }
			});	
		}
		
		
	});
	//add-new-client
	
	$( "#editPopUP" ).dialog({
		autoOpen: false,modal:true,
		height: 700,
		width: 900,
		
		buttons: {
			"Done": function() {
				
				$("#userFormPop").submit();
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			
		}
	});

	$("#userFormPop").validate({
		submitHandler: function(form) {
			userFormPop = $("#userFormPop");
			var url = $("#userFormPop").attr('action');
			var tel_cell_code 	= cellcode($('[name="tel_cell_code"]',userFormPop).val());
			var tel_otro_code 	= cellcode($('[name="tel_otro_code"]',userFormPop).val());
			var tel_part_code 	= $('[name="tel_part_code"]',userFormPop).val();
			var tel_lab_code 	= $('[name="tel_lab_code"]',userFormPop).val();
			var tel_cell	  	= cellnumber($('[name="tel_cell"]',userFormPop).val());
			var tel_otro		= cellnumber($('[name="tel_otro"]',userFormPop).val());					
			var tel_part	  	= landnumber($('[name="tel_part"]',userFormPop).val());
			var tel_lab			= landnumber($('[name="tel_lab"]',userFormPop).val());
			$.post(url, { 
							"id" 			: $(' [name="id"]',userFormPop).val(),
							"client_type"   : $(' [name="client_type"]',userFormPop).val(),
							"first_name"  	: $(' [name="first_name"]',userFormPop).val(),
							"last_name"  	: $(' [name="last_name"]',userFormPop).val(),
							"DNI"  			: $(' [name="DNI"]',userFormPop).val(),
							"CUIL" 			: $(' [name="CUIL"]',userFormPop).val(),
							"tel_part"  	: tel_part,
							"tel_part_code" : tel_part_code,
							"tel_lab"  		: tel_lab,
							"tel_lab_code"	: tel_lab_code,
							"tel_cell"  	: tel_cell,
							"tel_cell_code"	: tel_cell_code,
							"tel_otro"  	: tel_otro,
							"tel_otro_code" : tel_otro_code,
							"email" 		: $(' [name="email"]',userFormPop).val(),
							"activity"  	: $(' [name="activity"]',userFormPop).val(),
							"date_added"  	: $(' [name="date_added"]',userFormPop).val(),
							"operator"  	: $(' [name="operator"]',userFormPop).val(),
							"contact_point" : $(' [name="contact_point"]',userFormPop).val(),
							"extra_info"  	: $(' [name="extra_info"]',userFormPop).val(),
							"business" 		: $('[name="business"]',userFormPop).val(),
							"business_CUIT" : $('[name="business_CUIT"]',userFormPop).val()
						},
						
					 function(data){
							if(data){
							  	var selRow = $("#grid .row_selected");

                           		$(".user_client_type",selRow).text($('[name="client_type"] option:selected',userFormPop).text());
							  	$(".user_first_name",selRow).text($('[name="first_name"]',userFormPop).val());
							  	$(".user_last_name",selRow).text($('[name="last_name"]',userFormPop).val());
								$(".user_DNI",selRow).text($('[name="DNI"]',userFormPop).val());
								$(".user_CUIL",selRow).text($('[name="CUIL"]',userFormPop).val());
								$(".user_tel_part",selRow).html(CreateSpansForViewNumber($('[name="tel_part_code"]',userFormPop).val(),$('[name="tel_part"]',userFormPop).val()));
								$(".user_tel_lab",selRow).html(CreateSpansForViewNumber($('[name="tel_lab_code"]',userFormPop).val(),$('[name="tel_lab"]',userFormPop).val()));
								$(".user_tel_cell",selRow).html(CreateSpansForViewNumber($('[name="tel_cell_code"]',userFormPop).val(),$('[name="tel_cell"]',userFormPop).val()));
								$(".user_tel_otro",selRow).html(CreateSpansForViewNumber($('[name="tel_otro_code"]',userFormPop).val(),$('[name="tel_otro"]',userFormPop).val()));
								$(".user_email",selRow).text($('[name="email"]',userFormPop).val());
								$(".user_activity",selRow).text($('[name="activity"]',userFormPop).val());
								$(".user_date_added",selRow).text($('[name="date_added"]',userFormPop).val());
								$(".user_operator",selRow).html($('[name="operator"] option:selected',userFormPop).text()+'<input type="hidden" name="ct_id" value="'+$('[name="operator"] option:selected',userFormPop).val()+'"/>');
								$(".user_contact_point",selRow).html( $('[name="contact_point"] option:selected',userFormPop).text()+'<input type="hidden" name="contact_point_id" value="'+$('[name="contact_point"] option:selected',userFormPop).val()+'"/>');
								$(".user_extra_info",selRow).text($('[name="extra_info"]',userFormPop).val());
								$(".user_business",selRow).text($('[name="business"]',userFormPop).val());
								$(".user_business_CUIT",selRow).text($('[name="business_CUIT"]',userFormPop).val());
							
								showmsg("Updated Successfully!",'t');
							  $( "#editPopUP" ).dialog('close'); 							
						  }else{
							  showmsg("Oops Updating user not get successfully done.\n Please Try Again",'f');
							  $( "#editPopUP" ).dialog('close'); 
						  }
						 $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
			});
		}
		
		
	});
	
	
	$('.client_type').change(function(){
		if($('option:selected',this).hasClass('addnew')){
			$(".add-new-client").dialog('open');
		}	
	});
	$( ".edit-bank-details" ).dialog({
		autoOpen: false,modal:true,
		
		height: 400,
		width: 500,
		buttons: {
			"Done": function() {		
					var url = $('#editBankForm').submit();
			},
			"Cancel": function() {
			
				$( this ).dialog( "close" );
			}
		}
    });
	$( ".edit-address-details" ).dialog({
		autoOpen: false,modal:true,
		
		height: 500,
		width: 500,
		buttons: {
			"Done": function() {		
					var url = $('#editAddForm').submit();
			},
			"Cancel": function() {
			
				$( this ).dialog( "close" );
			}
		}
    });
	$( ".addNewOperatorPop" ).dialog({
		autoOpen: false,modal:true,
		
		height: 300,
		width: 500,
		buttons: {
			"Done": function() {		
					var url = $('#operatorForm').submit();
			},
			"Cancel": function() {
			
				$( this ).dialog( "close" );
			}
		}
    });
	$(".addAddressBtn").click(function(){
		
		$( ".addAddressPop" ).dialog('open');
	});
	$(".editAddressBtn").live('click',function(){
		
		var tForm 	= $("#EditAddressForm");
		$('.new_address_span',tForm).remove();
		clearForm(tForm);
		$( ".editAddressPop" ).dialog('open');
		
		var clientid = $("#userFormPop [name='id']").val();
		var url = "/index/getaddressbyclientidajax";
		$('[name="client_id"]',tForm).val(clientid);
		$('.edit_address_main_div').html('<h1>Loading...</h1>');
		$.post(url, { 
			"client_id" : clientid
		},function(data){
			if(data && data != ''){
				$('.edit_address_main_div').html('');
				for(var x in data){
					var jsonData = data[x];
					var newAddSpan = CreateAddressSpan();
					
					var id					=	jsonData['id'];
					var street				=	jsonData['street'];
					var city				=	jsonData['city'];
					var zip_code			=	jsonData['zip_code'];
					var state				=	jsonData['state'];
					var state_name			=	jsonData['state_name'];
					var country				=	jsonData['country'];
					var address_type		=	jsonData['address_type'];
					var delivery_address	=	jsonData['delivery_address'];
					
					$('[name="id"]',newAddSpan).val(id);
					$('[name="street"]',newAddSpan).val(street);
					$('[name="city"]',newAddSpan).val(city);
					$('[name="zip_code"]',newAddSpan).val(zip_code);
					$('.state_select option[value="'+state+'"]',newAddSpan).attr({'selected':'selected'});
					$('.[name="address_type"] option[value="'+address_type+'"]',newAddSpan).attr({'selected':'selected'});
					
					if(parseInt(delivery_address)){
						$('[name="delivery_address"]',newAddSpan).attr({'checked':'checked'});
					}
					$('.edit_address_main_div').append(newAddSpan);
					
				}
				
				$(".editAddressPop").dialog('open');
			}else{
				$('.edit_address_main_div').html('');
				showmsg("Oops There is no Addresses Added before!",'f');
			}							
		},'json');
		
	});
	$( ".editAddressPop" ).dialog({
		autoOpen: false,modal:true,
		height: 600,
		width: 700,
		buttons: {
			"Guardar": function() {
				var tForm = $("#EditAddressForm");
				tForm.submit();
			},
			"Agregar Otro": function() {	
				$('.edit_address_main_div').append(CreateAddressSpan());
			},
		},
		close: function() {
			$('#userFormPop [name="activity"]').focus();
		}
    });
	$("#operatorForm").validate({
			submitHandler: function(form) {
				var tForm = $("#operatorForm");
				var url = tForm.attr('action');
				$.post(url, { 
								"name" 		: $(' input[name="name"]',tForm).val(),
								"last_name" : $(' input[name="last_name"]',tForm).val(),
								"email"  	: $(' input[name="email"]',tForm).val(),
								"password" 	: $(' input[name="password"]',tForm).val()
							},
							function(data){							
								if(isInt(data)){
									var newOption = "";
									newOption += '<option value="'+data+'">'+$(' input[name="name"]',tForm).val()+'</option>';
									$("#operatorDrp .addNewOperatorDrp").before(newOption);
									$('#operatorDrp  option[value="'+data+'"]').attr({'selected':'selected'});
									$("#userFormPop [name='operator']").append(newOption);
									$( ".addNewOperatorPop" ).dialog('close');
									showmsg("Add Operador is Successfully",'t');
									clearForm(tForm);
									
								}else{
									showmsg("Oops!",'f');
								}							
							});
			}
		});
	$("#editBankForm").validate({
		submitHandler: function(form) {
			editBankForm = $("#editBankForm");
			var url = editBankForm.attr('action');
			$.post(url, { 
				"id"		   		: $('[name="id"]',editBankForm).val(),
				"bank_name"  		: $('[name="bank_name"]',editBankForm).val(),
				"account_n" 		: $('[name="account_n"]',editBankForm).val(),
				"branch"  			: $('[name="branch"]',editBankForm).val(),
				"opening_date"		: $('[name="opening_date"]',editBankForm).val(),
				"zip_code"			: $('[name="zip_code"]',editBankForm).val(),
				"location_capital"	: $('[name="location_capital"]:checked',editBankForm).val(),
			},
			
				 function(data){
				  if(data){
					 var bankTr = $("#bankid_"+$('[name="id"]',editBankForm).val());
					 $('.td_bank_name',bankTr).html(
							 $('[name="bank_name"]',editBankForm).val()+
							 '<input type="hidden" name="zip_code" value="'+$('[name="zip_code"]',editBankForm).val()+'" />'+
							 '<input type="hidden" name="location_capital" value="'+$('[name="location_capital"]:checked',editBankForm).val()+'" />'						
					);
					 $('.td_account_n',bankTr).html($('[name="account_n"]',editBankForm).val());
					 $('.td_branch',bankTr).html($('[name="branch"]',editBankForm).val());
					 if($('input[name="opening_date"]',editBankForm).val() == ''){
						 $('.td_opening_date',bankTr).html('Not Specified');
					 }else{
						 $('.td_opening_date',bankTr).html($('input[name="opening_date"]',editBankForm).val());
					 }
					  
					  clearForm(editBankForm); 
					  showmsg("Updated Successfully!",'t');
					  $( ".edit-bank-details" ).dialog('close'); 							
				  }else{
					  showmsg("Oops Updating Bank Details not get successfully done.\n Please Try Again");
					  $( ".edit-bank-details" ).dialog('close'); 
				  }
			});		
		}
		
		
	});
	$("#editAddForm").validate({
		submitHandler: function(form) {
			editBankForm = $("#editAddForm");
			var url = editBankForm.attr('action');
			$.post(url, { 
				"id"		   	: $('[name="id"]',editBankForm).val(),
				"street"  		: $('[name="street"]',editBankForm).val(),
				"city" 			: $('[name="city"]',editBankForm).val(),
				"client_id"		: $('[name="client_id"]',editBankForm).val(),
				"zip_code"  	: $('[name="zip_code"]',editBankForm).val(),
				"state"			: $('[name="state_select"]',editBankForm).val(),
				"address_type"	: $('[name="address_type"]',editBankForm).val(),
			},
			
				 function(data){
				  if(data){
					 var bankTr = $("#addressid_"+$('input[name="id"]',editBankForm).val());
					 $('.td_street'			,bankTr).html(	$('[name="street"]'		,editBankForm).val());
					 $('.td_city'			,bankTr).html(	$('[name="city"]'			,editBankForm).val());
					 $('.td_zip_code'		,bankTr).html(	$('[name="zip_code"]'		,editBankForm).val());
					 $('.td_state'			,bankTr).html(	$('[name="state_select"] option:selected'	,editBankForm).text());
					 $('.td_address_type'	,bankTr).html(	$('[name="address_type"] option:selected'	,editBankForm).text());
					 
					 
					  var seltr = $('#userid_'+$('[name="client_id"]',editBankForm).val());
					  $('.amBtn',seltr).trigger('click', [true]);
					  clearForm(editBankForm); 
					 
					  showmsg("Updated Successfully!",'t');
					  $( ".edit-address-details" ).dialog('close'); 							
				  }else{
					  showmsg("Oops Updating Address Details not get successfully done.\n Please Try Again");
					  $( ".edit-address-details" ).dialog('close'); 
				  }
			});		
		}
		
		
	});
	
	$('.editBankBtn').live('click',function(){
		
		var bankTr = $(this).parents('tr:eq(0)');
		var bankid = bankTr.attr('id').split('_');
		var editBankForm = $('#editBankForm');
		$('[name="id"]',editBankForm).val(bankid[1]);
		$('[name="bank_name"]',editBankForm).val($('.td_bank_name',bankTr).text());
		$('[name="account_n"]',editBankForm).val($('.td_account_n',bankTr).text());
		$('[name="branch"]',editBankForm).val($('.td_branch',bankTr).text());
		$('[name="zip_code"]',editBankForm).val($('[name="zip_code"]',bankTr).val());
		$('[name="location_capital"][value="'+$('[name="location_capital"]',bankTr).val()+'"]',editBankForm).attr('checked','checked');
		if($('.td_opening_date',bankTr).text() == 'Not Specified'){
			$('[name="opening_date"]',editBankForm).val('');
		}else{
			$('[name="opening_date"]',editBankForm).val($('.td_opening_date',bankTr).text());
		}
		
		$( ".edit-bank-details" ).dialog('open');
	});
	$('.editAddBtn').live('click',function(){
		
		var client = $(this).parents('table:eq(0)');
		var client_id = client.attr('id').split('_');
		
		var bankTr = $(this).parents('tr');
		var bankid = bankTr.attr('id').split('_');
		var editBankForm = $('#editAddForm');
		$('[name="id"]',editBankForm).val(bankid[1]);
		$('[name="client_id"]',editBankForm).val(client_id[1]);
		$('[name="street"]',editBankForm).val($('.td_street',bankTr).html());
		$('[name="city"]',editBankForm).val($('.td_city',bankTr).html());
		$('[name="zip_code"]',editBankForm).val($('.td_zip_code',bankTr).html());
		$('[name="state_select"] option[value="'+$('.td_state input:hidden',bankTr).val()+'"]',editBankForm).attr({'selected':'selected'});
		$('[name="address_type"] option[value="'+$('.td_address_type',bankTr).html()+'"]',editBankForm).attr({'selected':'selected'});
		
		$( ".edit-address-details" ).dialog('open');
	});
	$('.addNewAddBtn').live('click',function(){
		
		var bankTr = $(this).parents('table:eq(0)');
		var bankid = bankTr.attr('id').split('_');
		var editBankForm = $('#editAddForm');
		$('[name="client_id"]',editBankForm).val(bankid[1]);
		
		$( ".edit-address-details" ).dialog('open');
	});
	$('.addPriorAddBtn').live('click',function(){
		
		var bankTr = $(this).parents('table:eq(0)');
		var bankid = bankTr.attr('id').split('_');
		var editBankForm = $('#EditPriorClientForm');
		$('[name="client_id"]',editBankForm).val(bankid[1]);
		
		$( ".EditPriorFromClientPanel" ).dialog('open');
	});
	$('.deleteBankBtn').live('click',function(){
		
		var bankTr = $(this).parents('tr');
		var bankid = bankTr.attr('id').split('_');
		var url = '/index/deletebankaccountajax';
		$.post(url, { 
			'id'				:	bankid[1]
		},
		function(data){						
			 if(data){
				 	bankTr.eq(0).remove();
				 	showmsg('Bank Account is Deleted Successfully!','t');		  
			 }else{
				 	showmsg('Bank Account is Deleted Not Successfully!','f');
			 }
		});
	});
	
	$('.toolTipCancelBtn').click(function(){
		$('.tooltipBox').hide();
	});

	
	
	$('#operatorDrp').change(function(){
		if($('option:selected',this).hasClass('addNewOperatorDrp')){
			clearForm($("#operatorForm"));
			$( ".addNewOperatorPop" ).dialog('open');
		}
	});
	$('#ContactPointDrp').change(function(){
		if($('option:selected',this).hasClass('addnew')){
			clearForm($("#AddNewContactPointForm"));
			$( ".addNewContactPop" ).dialog('open');
		}
	});
	
	jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
	    phone_number = phone_number.replace(/\s+/g, ""); 
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^[0-9]{2}[-]{1}[0-9]{8}[-]{1}[0-9]{1}$/);
	}, "Please specify a valid phone number");
	/*jQuery.validator.addMethod("cellphone", function(phone_number, element) {
	    phone_number = phone_number.replace(/\s+/g, ""); 
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^[0-9]{3}[-]{1}[0-9]{4}[-]{1}[0-9]{4}$/);
	}, "Please specify a valid cell phone number");
	jQuery.validator.addMethod("landphone", function(phone_number, element) {
	    phone_number = phone_number.replace(/\s+/g, ""); 
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^\([1-9]\d{3}\)\s?\d{3}\-\d{4}$/);
	}, "Please specify a valid land phone number");*/
	
	$(".addNewBankBtn").live('click',function(){
		var bankDataTableId = $(this).parents('table').attr('id').split('_');
		$('#userBankForm input[name="user_id"]').val(bankDataTableId[1]);
		$('#userBankForm input[name="addType"]').val('listing');
		$(".confirm-add-user").dialog('open');
	});
	$('.nameCap').keyup(function(evt){
		$str = $(this).val().capitalize();
		$(this).val($str);
	});
	String.prototype.capitalize = function(){
		   return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
	};
	
	$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');

});
$(document).ready(function(){
	var cForm = $('#userForm');
	var cPopForm = $('#userFormPop');
	AreaCodeBlur(cForm);
	AreaCodeBlur(cPopForm);
	
	
	
	$('[name="client_type"]',cForm).change(function(){
		if($(this).val() == '1'){
			$('[name="CUIL"]',cForm).removeClass('required');
		}else{
			$('[name="CUIL"]',cForm).addClass('required');			
		}
	});
	$('[name="client_type"]',cPopForm).change(function(){
		if($(this).val() == '1'){
			$('[name="CUIL"]',cPopForm).removeClass('required');
		}else{
			$('[name="CUIL"]',cPopForm).addClass('required');			
		}
	});
	$('[name="client_type"]',cForm).trigger('change');
	$('[name="CUIL"]',cForm).blur(function(){
		var lp = $(this);
		if(lp.val().length > 2){
			var lpstr = lp.val();
			var finStr = '';
			lpstr = lpstr.split('-').join('');
			finStr += lpstr.substring(0,2);
			finStr += '-'+lpstr.substring(2,10);
			if(lpstr.length > 10){
				
				finStr += '-'+lpstr.substring(10,11);
			}
			lp.val(finStr);			
		}
		
		lpstr = finStr.split('-');
		if(lpstr.length){
			if(isInt(lpstr[1]) && $.trim($('[name="DNI"]',cForm).val()) == ''){				
				$('[name="DNI"]',cForm).val(lpstr[1]);
			}
		}
	});
	$('[name="business_CUIT"]').blur(function(){
		var lp = $(this);
		if(lp.val().length > 2){
			var lpstr = lp.val();
			var finStr = '';
			lpstr = lpstr.split('-').join('');
			finStr += lpstr.substring(0,2);
			finStr += '-'+lpstr.substring(2,10);
			if(lpstr.length > 10){
				
				finStr += '-'+lpstr.substring(10,11);
			}
			lp.val(finStr);			
		}		
	});
	$('[name="CUIL"]',cPopForm).blur(function(){
		var lp = $(this);
		if(lp.val().length > 2){
			var lpstr = lp.val();
			var finStr = '';
			lpstr = lpstr.split('-').join('');
			finStr += lpstr.substring(0,2);
			finStr += '-'+lpstr.substring(2,10);
			if(lpstr.length > 10){
				
				finStr += '-'+lpstr.substring(10,11);
			}
			lp.val(finStr);			
		}
		
		lpstr = finStr.split('-');
		if(lpstr.length){
			if(isInt(lpstr[1]) && $.trim($('[name="DNI"]',cPopForm).val()) == ''){				
				$('[name="DNI"]',cPopForm).val(lpstr[1]);
			}
		}
	});
		
	
	
	$('.landphone').blur(function(){
		var lp = $(this);
		if(lp.val().length > 4){
			var lpstr = lp.val();
			lpstr = lpstr.split('-').join('');
			var lpArr = Array();
			var sublpstr;
			for(var i = lpstr.length; i >= 0; i -= 4){
				sublpstr = lpstr.substring(i-4,i);
				if(sublpstr != ''){lpArr.push(sublpstr);}
			}
			lp.val(lpArr.reverse().join('-'));			
		}
	});
	
	$('.cellphone').blur(function(){
		var lp = $(this);
		if(lp.val().length > 4){
			var lpstr = lp.val();
			lpstr = lpstr.split('-').join('');			
			lpstr = '15'+(lpstr.substring(2,lpstr.length))
			var lpArr = Array();
			var sublpstr;
			for(var i = lpstr.length; i >= 0; i -= 4){
				sublpstr = lpstr.substring(i-4,i);
				if(sublpstr != ''){lpArr.push(sublpstr);}
			}
			lp.val(lpArr.reverse().join('-'));			
		}
	});
	
	$('.cellphone').focus(function(){
		if($(this).val() == ''){
			$(this).val('15');
			cellDeselect = $(this);	
			return false;	
		}
	});
	$('.cellphone').blur(function(){
		if($(this).val() == '15'){
			$(this).val('');
		}
	});
	$('.areacode').focus(function(){
		if($(this).val() == ''){
			$(this).val('0');
			return false;
		}
	});
	$('.areacode').blur(function(){
		if($(this).val() == '0'){
			$(this).val('');
		}
	});
	$('.areacode').keyup(function(){
		var ac = $(this);
		var acstr = ac.val();
		acstr = '0'+(acstr.substring(1,acstr.length))
		ac.val(acstr);
	});
	
	jQuery.fn.ForceNumericOnly =
		function()
		{
		    return this.each(function()
		    {
		        $(this).keydown(function(e)
		        {
		            var key = e.charCode || e.keyCode || 0;
		            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
		            return (
		                key == 8 || 
		                key == 9 ||
		                key == 46 ||
		                (key >= 37 && key <= 40) ||
		                (key >= 48 && key <= 57) ||
		                (key >= 96 && key <= 105));
		        })
		    })
		};
		$('.onlynumbers').ForceNumericOnly();	
	
});
function AreaCodeBlur(cForm){
	$('[name="tel_part_code"]',cForm).blur(function(){
		var areacode = $(this);
		if(areacode.val().length >= 3){
			var max_length_tel_part = 12 - areacode.val().length;
			var tel_part = $('[name="tel_part"]',cForm);
			tel_part.attr({'maxlengthattr':max_length_tel_part});
			if(tel_part.val().length > max_length_tel_part){
				tel_part.val('');
			}			
		}else{
			$('[name="tel_part"]',cForm).attr({'maxlengthAttr':9});
		}
	});
	$('[name="tel_lab_code"]',cForm).blur(function(){
		var areacode = $(this);
		if(areacode.val().length >= 3){
			var max_length_tel_lab = 12 - areacode.val().length;
			var tel_lab = $('[name="tel_lab"]',cForm);
			tel_lab.attr({'maxlengthattr':max_length_tel_lab});
			if(tel_lab.val().length > max_length_tel_lab){
				tel_lab.val('');
			}			
		}else{
			$('[name="tel_lab"]',cForm).attr({'maxlengthAttr':9});
		}
	});
	$('[name="tel_cell_code"]',cForm).blur(function(){
		var areacode = $(this);
		var areacodelen = areacode.val().length;
		var max_length_tel_cell;
		if(areacodelen >= 4){
			if(areacodelen == 4){
				max_length_tel_cell = 9;
			}else if(areacodelen == 5){
				max_length_tel_cell = 8;	
			}
			var tel_cell = $('[name="tel_cell"]',cForm);
			tel_cell.attr({'maxlengthattr':max_length_tel_cell});
			if(tel_cell.val().length > max_length_tel_cell){
				tel_cell.val('');
			}			
		}else{
			$('[name="tel_cell"]',cForm).attr({'maxlengthAttr':12});
		}
	});
	$('[name="tel_otro_code"]',cForm).blur(function(){
		var areacode = $(this);
		var areacodelen = areacode.val().length;
		var max_length_tel_otro;
		if(areacodelen >= 4){
			if(areacodelen == 4){
				max_length_tel_otro = 9;
			}else if(areacodelen == 5){
				max_length_tel_otro = 8;	
			}
			var tel_otro = $('[name="tel_otro"]',cForm);
			tel_otro.attr({'maxlengthattr':max_length_tel_otro});
			if(tel_otro.val().length > max_length_tel_otro){
				tel_otro.val('');
			}			
		}else{
			$('[name="tel_otro"]',cForm).attr({'maxlengthAttr':12});
		}
	});
}


function cellcode(code){
	if(code.length){
		code = '+54'+code.substring(1,code.length);
	}else{
		//code = '+5411';			
	}
	return code;
}
function cellnumber(number){
	number = number.split('-').join('');
	if(number.length >= 10){
		number = number.substring(2,number.length);
	}else{
		number = number.substring(1,number.length);		
	}
	return number;	
}
function landnumber(number){
	if(number.length){
		number = number.split('-').join('');
	}
	return number;	
}
function CreateSpansForViewNumber(code,number){
	var cnspan = '<span class="area_code_inp">'+code+'</span> <span class="number_inp">'+number+'</span>';
	return cnspan;
}
function CreateAddressSpan(){
	var defaultAddressSpan =  $('.address_defale_span').clone().html();
	var stateSelectId = $('.state_select',defaultAddressSpan).attr('id').split('_');
	var newIdNum = parseInt(stateSelectId[1])+1;
	stateSelectId = stateSelectId[0]+'_'+newIdNum;
	$('.address_defale_span .state_select').attr({'id':stateSelectId});
	$('.state_select',defaultAddressSpan).attr({'id':stateSelectId})
	var span = $('<span class="address_span new_address_span"></span>');
	var newAddSpan = span.html(defaultAddressSpan);
	return newAddSpan;
}
function CreateShowAddressView(data){
		var str					=	'';
		var jsonData			=	data;
		var id					=	jsonData['id'];
		var street				=	jsonData['street'];
		var city				=	jsonData['city'];
		var zip_code			=	jsonData['zip_code'];
		var state				=	jsonData['state'];
		var state_name			=	jsonData['state_name'];
		var country				=	jsonData['country'];
		var address_type		=	jsonData['address_type'];
		var delivery_address	=	parseInt(jsonData['delivery_address'])?'True':'False';
 
	
		str		=	'<table>'+
						'<tr>'+
							'<td width="100">Domicilio</td><td> : </td><td>'+street+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Barrio / Ciudad</td><td> : </td><td>'+city+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>C.P.</td><td> : </td><td>'+zip_code+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Provincia</td><td> : </td><td>'+state_name+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Tipo de Domicilio</td><td> : </td><td>'+address_type+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Env&iacute;o</td><td> : </td><td>'+delivery_address+'</td>'+
						'</tr>'+
					'</table>';
		return str;
}
function cellPhoneValid(th){
	var maxlength	=	parseInt(th.getAttribute("maxlengthattr",2));
	if(th.value.length	>	maxlength){
		th.value =	th.value.substr(0,maxlength);		
	}
};
function disableSelection(target){
	if (typeof target.onselectstart!="undefined"){ //IE route
	        target.onselectstart=function(){return false;}
	}else if (typeof target.style.MozUserSelect!="undefined"){ //Firefox route
	        target.style.MozUserSelect="none";
	}else{ //All other route (ie: Opera)
	        target.onmousedown=function(){return false;}
	}       
	target.style.cursor = "default"
}
var currentTime = new Date;
var month		= currentTime.getMonth() + 1;
month			=	month < 10 ? '0'+month : month;
var day			= currentTime.getDate();
day				=	day < 10 ? '0'+day : day;
var year		= currentTime.getFullYear();
var currentDate	=	day + "/" + month + "/" + year;

function recDate(oldDate,rec){
	var oldDateArr	=	oldDate.split('/'); 
	var myDate=new Date();
	myDate.setFullYear(oldDateArr[2],oldDateArr[1]-1,oldDateArr[0]);
	myDate.setDate(myDate.getDate()+rec);
	var newDate =	myDate.getDate();
	newDate		=	newDate	< 10 ? '0' + newDate : newDate; 
	var newMonth =	myDate.getMonth()+1;
	newMonth	=	newMonth < 10 ? '0' + newMonth : newMonth;
	var newYear =	myDate.getFullYear();
	var newFullYear	=	newDate+'/'+newMonth+'/'+newYear;
	//alert(newFullYear);
	return newFullYear;
}
function pdfSwitch(stateid,statustime,cave_id){
	var pdf_Arr	= new Array();
	var pdf_list		=	'';
	rejectedBtn	=	'';
	pdf_list		=	'<span  class="details_pdf"  ><input type="hidden" value="1"/><img src="/images/pdf_icon.png"/> Mutuo 1 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
	pdf_list		+=	'<span  class="details_pdf"  ><input type="hidden" value="2"/><img src="/images/pdf_icon.png"/> Mutuo 2 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
	pdf_list		+=	'<span  class="details_pdf"  ><input type="hidden" value="3"/><img src="/images/pdf_icon.png"/> Mutuo 3 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
	pdf_list = '<div style="margin-top:.5em">'+pdf_list+'</div>'
	if(stateid == 4 && cave_id	==	1){
		stateid	=	11;
	}
	if(stateid == 5 && cave_id	==	1){
		stateid	=	12;
	}
	if(stateid == 6 && cave_id	==	1){
		stateid	=	13;
	}
	switch(stateid){
		case 1: 
			statusTxt 		=	'<div class="stateViewDiv">Nueva Operación: '+statustime+'</div>';
			nextClsName 	=	'operationStepTwo';
			nextBtnText		=	'Pedido de Informe';
			pdf_list		=	'';
		break;
		case 9:
			statusTxt 		=	'<div class="stateViewDiv">Aguardando Informe: '+statustime+'</div>';
			nextClsName 	=	'operationStepThree';
			nextBtnText		=	'Informe Aprovado';
			rejectedBtn		=	'<br/><br/><span class="ui-state-default ui-corner-all"><span class="jq-link-btn">Informe Desaprobado</span></span>'
			pdf_list		=	'';
			break;
		case 10:
			statusTxt 		=	'<div class="stateViewDiv">Reporte Aprovado: '+statustime+'</div>';
			nextClsName 	=	'operationStepFour';
			nextBtnText		=	'Seleccionar Plan';
			pdf_list		=	'';
			break;
		case 4:
			statusTxt 		=	'<div class="stateViewDiv">Operación Cerrada: '+statustime+'</div>';
			nextClsName 	=	'operationStepFive';
			nextBtnText		=	'Operación en Camino';									
			break;
		case 5:
			statusTxt 		=	'<div class="stateViewDiv">Operación en Camino: '+statustime+'</div>';
			nextClsName 	=	'operationStepSix';
			nextBtnText		=	'Insertar Cheques';
			break;
		case 6:
			statusTxt 		=	'<div class="stateViewDiv">Operación Pagada: '+statustime+'</div>';
			nextClsName 	=	'operationStepSix';
			nextBtnText		=	'Insertar Cheques';
			break;
		case 11:
			statusTxt 		=	'<div class="stateViewDiv">Operación Cerrada: '+statustime+'</div>';
			nextClsName 	=	'operationStepFive';
			nextBtnText		=	'Pasado a Lavalle';									
			break;
		case 12:
			statusTxt 		=	'<div class="stateViewDiv">Pasado a Lavalle: '+statustime+'</div>';
			nextClsName 	=	'operationStepSix';
			nextBtnText		=	'Asignar Ubicación';
			break;
		case 13:
			statusTxt 		=	'<div class="stateViewDiv">Asignar Ubicación: '+statustime+'</div>';
			nextClsName 	=	'operationStepSix';
			nextBtnText		=	'Insertar Cheques';
			break;
		case 14:
			statusTxt 		=	'<div class="stateViewDiv">Operación Pagada: '+statustime+'</div>';
			break;	
		default:
			statusTxt 		= '<div> </div>';
			nextClsName 	= 'addNewOperations';	
			nextBtnText		= 'Nueva Operación';
			pdf_list		=	'';
		break;
	}
	pdf_Arr['pdf_list']	=	pdf_list;
	pdf_Arr['statusTxt']	=	statusTxt;
	pdf_Arr['nextClsName']	=	nextClsName;
	pdf_Arr['nextBtnText']	=	nextBtnText;
	pdf_Arr['rejectedBtn']	=	rejectedBtn;
	return pdf_Arr;
									
}
function datepicker(){
	
	$( ".datepicker" ).datepicker({ 
		changeMonth: true,
        changeYear: true,
		"dateFormat": 'dd/mm/yy',
	});
	$( ".datepicker" ).focus(function(){
		$('.ui-datepicker-calendar').show();
	});
	
}
function getToolTipForm(ele){
	
	var tooltipBox	=	$('.tooltipBox');
	tooltipBox.show();
	var x = ele.offset().left;
	var y = ele.offset().top;
	x = x - tooltipBox.width() - 10;
	tooltipBox.css({'top':y+'px','left': x+'px'});
	return tooltipBox;
}