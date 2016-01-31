<?php
class HOA_Helper_Test  extends Zend_View_Helper_Abstract
{
	public  $view;
	
    public function test($amount)
    {
        return '$ '.number_format($amount, 2, '.', ',');
    }
 	public function setView(Zend_View_Interface $view)
    {
        $this->view = $view;
    }
    
}