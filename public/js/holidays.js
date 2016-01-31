$(function() {
	
		$( ".datepicker" ).datepicker({ 
					changeMonth: true,
			        changeYear: true,
					"dateFormat": 'dd/mm/yy' 
		});
		
		$('.dateTable  .addDate').live('click',function(){
			addDateTr();
		});
		$('.dateTable  .removeDate').live('click',function(){
			$(this).parents('tr:eq(0)').remove();
		});
		$("#gyForm").validate({
			submitHandler: function(form) {
				tForm = $("#gyForm");

				var url = tForm.attr('action');
				var dateMainArr	=	[];
				$('[name^="datepicker_id_"]').each(function(){
					var dateArr	=	{
					           	 	 	'id' 	: '',
					           	 	 	'date' 	: $(this).val(),
									};
					dateMainArr.push(dateArr);
				});
				var dateMainJson	=	JSON.stringify(dateMainArr);
				$.post(url, { 
								"holidays_json"			: dateMainJson,								
							},
						function(data){
								showmsg("holidays changes updated!",'t');
						
				});
				
			}	
		});
		
});
datepicker_id	=	50;
function addDateTr(){
	datepicker_id++;
	var dateTr	=	$('.dateTr').clone();
	var dateTrClone	=	'<tr id="datepicker_tr_'+datepicker_id+'">'+dateTr.html()+'</tr>';
	$('.dateTable').append(dateTrClone);
	$('.dateTable #datepicker_tr_'+datepicker_id+' .datepicker').attr({'class':'required datepicker','name':'datepicker_id_'+datepicker_id,'id':'datepicker_id_'+datepicker_id});
	$('.dateTable #datepicker_tr_'+datepicker_id+' .removeDate').show();
	$('.dateTable #datepicker_tr_'+datepicker_id+' .datepicker').val('');
	
	$('#datepicker_id_'+datepicker_id).datepicker({ 
		changeMonth: true,
        changeYear: true,
		"dateFormat": 'dd/mm/yy',
	});
}