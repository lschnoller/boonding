<?php
class Gyuser_Model_CrmConstants
{
	function getEventTypes()
	{
		$list[''] = '---';
		$list[1] = 'Seguimiento cl. potencial';
		$list[2] = 'Seguimiento cl. pasivo';
                $list[3] = 'Seguimiento cl. activo';
                $list[4] = 'Seguimiento cl. cobranza';
		$list[5] = 'Recordatorio de pago';
		return $list;
	}
	function getEventTypeSign($type)
	{
		$list[1] = '-';
		$list[2] = '-';
		$list[3] = '-';
                $list[4] = '-';
                $list[5] = '+';
		if(isset($list[$type]))
			return $list[$type];
		else
			return '+';
	}
	
	function getEventActions()
	{
		$list[''] = '---';
		$list[1] = 'Llamado Telefonico';
		$list[2] = 'Email';
		$list[3] = 'Mensaje de Texto';
		$list[4] = 'Mensaje de Voz';
		$list[5] = 'Escrache en Publica';
		return $list;
	}
	function getSpanUnit()
	{
		$list[''] = '---';
		$list['DAY'] = 'Dia(s)';
		$list['WEEK'] = 'Semana(s)';
		$list['MONTH'] = 'Mes(es)';
		$list['YEAR'] = 'Año(s)';
		return $list;
	}
	
	function getOperators()
	{
		$oMapper = new Gyuser_Model_OperatorDataMapper ();
		$opeObj = $oMapper->fetchAll();
		$operatorArray[''] = '---------';
		foreach ($opeObj AS $operator){
			$operatorArray[$operator->id] = $operator->name;
		}
		return $operatorArray;
	}
	
	function getOperatorTypes()
	{ 
		$list[''] = '---';
		$list[1] = 'Admin';
		$list[2] = 'Gestion de Cheques';
		$list[3] = 'Operador';
		return $list;
	}
	
	
	
	
	
}