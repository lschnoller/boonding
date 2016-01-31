<?php

/**
 * @see Zend_Db_Adapter_Pdo_Mysql
 */
require_once 'Zend/Db/Adapter/Pdo/Mysql.php';

/**
 * MySQL PDO adapter extended to set the timezone
 */
class HOA_Helper_CustomAdapter_Pdo_Mysql extends Zend_Db_Adapter_Pdo_Mysql
{
    /**
     * @var bool
     */
    protected $_initialized = false;

    /**
     * Connects to the database.
     *
     */
    protected function _connect()
    {
        parent::_connect();

        if (!$this->_initialized) {
            $this->_initialized = true;

            if ($this->_config['timezone']) {

                // Requires PHP 5.2+
                $dtz = new DateTimeZone($this->_config['timezone']);
                $offset = $dtz->getOffset(new DateTime('NOW')) / 60 / 60;
                if($offset > 0)
                    $offset = "+".$offset;
                /*
                echo "location: ".$dtz->getLocation()."<br />";
                echo "offset: ".$dtz->getOffset(new DateTime('NOW'))."<br />";
                echo "offset 2: ". $offset."<br />";
                echo "SET time_zone = '$offset:00'"."<br />";
                */
                $this->query("SET time_zone = '$offset:00';");//sprintf("SET time_zone = '%d:00'", $offset));
                                
                /*
                $timezone = new DateTimeZone($this->_config['timezone']);
                $minutes = $timezone->getOffset(new DateTime('NOW')) / 60 / 60;
                
                
                
                //$offset = sprintf("SET time_zone = '%d:%2d'", $minutes / 60, $minutes % 60);
                $offset = sprintf("SET time_zone = '%d:00'", $offset);
                 *
                 */
            }
        }
    }
}
?>
