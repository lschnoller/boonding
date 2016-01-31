<?php
class CRM_EventsForm extends Zend_Form
{
	/**
	 * Set up form fields, filtering and validation
	 */
	public function init()
	{
		$this->setAction('?');
		$this->setMethod(Zend_Form::METHOD_POST);
		
		$constantsModel = new Gyuser_Model_CrmConstants();
		$event_typeArray = $constantsModel->getEventTypes();
		$event_actionArray = $constantsModel->getEventActions();
		$eventUnitArray = $constantsModel->getSpanUnit();
		$operatorArray = $constantsModel->getOperatorTypes();
		//Event Type
		$this->addElement($event_type = new Zend_Form_Element_Select('event_type'));
		$event_type->setLabel('Tipo de Evento')->addMultiOptions($event_typeArray)->setRequired(true);
		$event_type->setAttrib('class', 'small-input');
		//Event Action
		$this->addElement($event_action = new Zend_Form_Element_Select('event_action'));
		$event_action->setLabel('Acción')->addMultiOptions($event_actionArray)->setRequired(true);
		$event_action->setAttrib('class', 'small-input');
		//Event Span Count
		$this->addElement($event_span_count = new Zend_Form_Element_Text('event_span_count'));
		$event_span_count->setLabel('Lapso')->setRequired(true);
		$event_span_count->setAttrib('class', 'required number small-input')->addValidator('Digits');
		//Event Span Unit
		$this->addElement($event_span_unit = new Zend_Form_Element_Select('event_span_unit'));
		$event_span_unit->setLabel('Tiempo')->addMultiOptions($eventUnitArray)->setRequired(true);
		$event_span_unit->setAttrib('class', 'small-input tiempo-select');
                
		//Operator
		$this->addElement($operator_id = new Zend_Form_Element_Select('operator_id'));
		$operator_id->setLabel('Asignado a:')->addMultiOptions($operatorArray)->setRequired(true);
		$operator_id->setAttrib('class', 'small-input');
		
		
		$this->addElement($submit = new Zend_Form_Element_Submit('submit'));
		$submit->setLabel('Guardar');
		
		
	}
	
	public function process (array $post, Zend_Db_Table_Row  $row)
	{
		$this->setDefaults($row->toArray());
		// 
		if (sizeof($post) && $this->isValid($post)) {
			try {
				$row->setFromArray($this->getValues());
				$row->save();
				return true;
			} catch (Exception $e) {
				$this->addDescription('There was an error saving your details');
				return $this;
			}
		}
		return $this;
	}
	
}