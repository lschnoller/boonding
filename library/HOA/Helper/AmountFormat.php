<?php
class HOA_Helper_AmountFormat
{
    public function amountFormatNull($amount) {
        if($amount)
            return '$ '.number_format($amount, 2, '.', ',');
        else
            return null;
    }
    public function amountFormat($amount)
    {
        return '$ '.number_format($amount, 2, '.', ',');
    }
    
}