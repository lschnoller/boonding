<?php

class Gyuser_Model_UserDataMapper {

    protected $_dbTable;

    public function setDbTable($dbTable) {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }

    public function getDbTable() {
        if (null === $this->_dbTable) {
            $this->setDbTable('Gyuser_Model_DbTable_User');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_User $User) {
        $data = array(
            "client_type" => $User->getClient_type(),
            "first_name" => $User->getFirst_name(),
            "last_name" => $User->getLast_name(),
            "DNI" => $User->getDNI(),
            "CUIL" => $User->getCUIL(),
            "tel_cell" => $User->getTel_cell(),
            "tel_lab" => $User->getTel_lab(),
            "tel_otro" => $User->getTel_otro(),
            "tel_part" => $User->getTel_part(),
            //"tel_cell_code" => $User->getTel_cell_code(),
            "tel_lab_code" => $User->getTel_lab_code(),
            "tel_otro_code" => $User->getTel_otro_code(),
            "tel_part_code" => $User->getTel_part_code(),
            "email" => $User->getEmail(),
            "activity" => $User->getActivity(),
            "date_added" => $User->getDate_added(),
            "operator" => (int) $User->getOperator(),
            "contact_point" => $User->getContact_point(),
            "extra_info" => $User->getExtra_info(),
            "business" => $User->getBusiness(),
            "business_CUIT" => $User->getBusiness_CUIT(),
            "type_change" => $User->getType_change()
        );

        if (null === ($id = $User->getId())) {
            unset($data['id']);

            $id = $this->getDbTable()->insert($data);
            if ($id) {
                $MultiAddressJson = $User->getMulti_address_json();
                $addressMapper = new Gyuser_Model_AddressDataMapper();
                $addresssJsonResult = $addressMapper->saveWithJson($MultiAddressJson, $id);

                $MultiPriorJson = $User->getMulti_prior_json();
                $priorMapper = new Gyuser_Model_PriorOperationsDataMapper();
                $PriorJsonResult = $priorMapper->saveWithJson($MultiPriorJson, $id);
            }
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function createTerceroClient(Gyuser_Model_User $User) {
        $data = array(
            "client_type" => 6, //tercero
            "first_name" => $User->getFirst_name(),
            "last_name" => $User->getLast_name(),
            "DNI" => $User->getDNI(),
            "CUIL" => $User->getCUIL(),            
            "date_added" => date("Y-m-d")
        );
        $id = $this->getDbTable()->insert($data);
        if (!$id) 
            throw Exception("Hubo un error al agreagar el cliente de terecero a la base de datos");
        else            
            return $id;
    }
    
    public function find($id, Gyuser_Model_User $User) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $User->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll(Gyuser_Model_UserType $userType) {
        $resultSet = $this->getDbTable()->fetchAll(
                $this->getDbTable()->select()
                        ->order('id ASC')
        );
        $entries = array();
        foreach ($resultSet as $row) {
            $CUIL = $row->CUIL;
            if ($CUIL != '') {
                $CUIL1 = substr($CUIL, 0, 2);
                $CUIL2 = substr($CUIL, 2, 8);
                $CUIL3 = substr($CUIL, 10, 1);
                $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
            }
            $tel_cell = $this->LandPhoneFormat($row->tel_cell);
            $tel_otro = $this->LandPhoneFormat($row->tel_otro);
            $tel_lab = $this->LandPhoneFormat($row->tel_lab);
            $tel_part = $this->LandPhoneFormat($row->tel_part);
            //$tel_cell_code = $this->CellPhoneAreaCodeFormat($row->tel_cell_code);
            $tel_otro_code = $this->areaCodeOut($row->tel_otro_code, $tel_otro);
            $tel_lab_code = $this->areaCodeOut($row->tel_lab_code, $tel_lab);
            $tel_part_code = $this->areaCodeOut($row->tel_part_code, $tel_part);
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setClient_type($row->client_type);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setDNI($row->DNI);
            $entry->setCUIL($CUIL);
            $entry->setTel_cell($tel_cell);
            $entry->setTel_lab($tel_lab);
            $entry->setTel_otro($tel_otro);
            $entry->setTel_part($tel_part);
            //$entry->setTel_cell_code($tel_cell_code);
            $entry->setTel_lab_code($tel_lab_code);
            $entry->setTel_otro_code($tel_otro_code);
            $entry->setTel_part_code($tel_part_code);
            $entry->setEmail($row->email);
            $entry->setActivity($row->activity);
            $entry->setDate_added(date("d/m/Y", strtotime($row->date_added)));
            $entry->setOperator($row->operator);
            $entry->setContact_point($row->contact_point);
            $entry->setExtra_info($row->extra_info);
            $entry->setBusiness($row->business);
            $entry->setBusiness_CUIT($row->business_CUIT);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function getClientsByType($clientType = null) 
    {
        if (!is_null($clientType)) {
            if(strtolower($clientType) == 'potenciales')
                $where = '(client_type = 1 OR client_type = 2) AND status = 1';
            elseif(strtolower($clientType) == 'activos')
                $where = 'client_type = 3 AND status = 1';
            elseif(strtolower($clientType) == 'cobranza')
                $where = 'client_type = 4 AND status = 1';
            elseif(strtolower($clientType) == 'todos')
                $where = 'client_type <> 6 AND status = 1';
        }
                
        $table = $this->getDbTable();
        $select = $table->select($table, array(
                    'id',
                    'client_type',
                    'CUIL',
                    'tel_cell',
                    'tel_otro',
                    'tel_lab',
                    'tel_part',
                    //'tel_cell_code',
                    'tel_otro_code',
                    'tel_lab_code',
                    'tel_part_code',
                    'email',
                    'date_added',
                    'operator',
                    'contact_point',
                    'extra_info',
                    'business',
                    'business_CUIT',
                    'activity'            
                ))
                ->where($where)
                ->order('id ASC');
        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row) {
            $CUIL = $row->CUIL;
            $CUIL1 = substr($CUIL, 0, 2);
            $CUIL2 = substr($CUIL, 2, 8);
            $CUIL3 = substr($CUIL, 10, 1);
            $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
            $tel_cell = $this->LandPhoneFormat($row->tel_cell);
            $tel_otro = $this->LandPhoneFormat($row->tel_otro);
            $tel_lab = $this->LandPhoneFormat($row->tel_lab);
            $tel_part = $this->LandPhoneFormat($row->tel_part);
            //$tel_cell_code = $this->CellPhoneAreaCodeFormat($row->tel_cell_code);
            $tel_otro_code = $row->tel_otro_code;
            $tel_lab_code = $row->tel_lab_code;
            $tel_part_code = $row->tel_part_code;
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setClient_type($row->client_type);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setDNI($row->DNI);
            $entry->setCUIL($CUIL);
            $entry->setTel_cell($tel_cell);
            $entry->setTel_lab($tel_lab);
            $entry->setTel_otro($tel_otro);
            $entry->setTel_part($tel_part);
            //$entry->setTel_cell_code($tel_cell_code);
            $entry->setTel_lab_code($tel_lab_code);
            $entry->setTel_otro_code($tel_otro_code);
            $entry->setTel_part_code($tel_part_code);
            $entry->setEmail($row->email);
            $entry->setActivity($row->activity);
            $entry->setDate_added(date("d/m/Y", strtotime($row->date_added)));
            $entry->setOperator($row->operator);
            $entry->setContact_point($row->contact_point);
            $entry->setExtra_info($row->extra_info);
            $entry->setBusiness($row->business);
            $entry->setBusiness_CUIT($row->business_CUIT);
            $entries[] = $entry;
        }
        return $entries;
    }
    
    public function fetchAllForClients(Gyuser_Model_UserType $userType) 
    {
        $table = $this->getDbTable();
        $select = $table->select($table, array(
                    'id',
                    'CUIL',
                    'tel_cell',
                    'tel_cell',
                    'tel_otro',
                    'tel_lab',
                    'tel_part',
                    //'tel_cell_code',
                    'tel_otro_code',
                    'tel_lab_code',
                    'tel_part_code',
                    'email',
                    'date_added',
                    'operator',
                    'contact_point',
                    'extra_info',
                    'business',
                    'business_CUIT',
                ))
                ->where('client_type = ?', 3)
                ->where('status = ?', true)
                ->order('id ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $CUIL = $row->CUIL;
            $CUIL1 = substr($CUIL, 0, 2);
            $CUIL2 = substr($CUIL, 2, 8);
            $CUIL3 = substr($CUIL, 10, 1);
            $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
            $tel_cell = $this->LandPhoneFormat($row->tel_cell);
            $tel_otro = $this->LandPhoneFormat($row->tel_otro);
            $tel_lab = $this->LandPhoneFormat($row->tel_lab);
            $tel_part = $this->LandPhoneFormat($row->tel_part);
            //$tel_cell_code = $this->CellPhoneAreaCodeFormat($row->tel_cell_code);
            $tel_otro_code = $this->areaCodeOut($row->tel_otro_code, $tel_otro);
            $tel_lab_code = $this->areaCodeOut($row->tel_lab_code, $tel_lab);
            $tel_part_code = $this->areaCodeOut($row->tel_part_code, $tel_part);
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setClient_type($row->client_type);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setDNI($row->DNI);
            $entry->setCUIL($CUIL);
            $entry->setTel_cell($tel_cell);
            $entry->setTel_lab($tel_lab);
            $entry->setTel_otro($tel_otro);
            $entry->setTel_part($tel_part);
            //$entry->setTel_cell_code($tel_cell_code);
            $entry->setTel_lab_code($tel_lab_code);
            $entry->setTel_otro_code($tel_otro_code);
            $entry->setTel_part_code($tel_part_code);
            $entry->setEmail($row->email);
            $entry->setActivity($row->activity);
            $entry->setDate_added(date("d/m/Y", strtotime($row->date_added)));
            $entry->setOperator($row->operator);
            $entry->setContact_point($row->contact_point);
            $entry->setExtra_info($row->extra_info);
            $entry->setBusiness($row->business);
            $entry->setBusiness_CUIT($row->business_CUIT);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function fetchAllForPotenciales(Gyuser_Model_UserType $userType) {
        $table = $this->getDbTable();
        $select = $table->select($table, array(
                    'id',
                    'CUIL',
                    'tel_cell',
                    'tel_cell',
                    'tel_otro',
                    'tel_lab',
                    'tel_part',
                    //'tel_cell_code',
                    'tel_otro_code',
                    'tel_lab_code',
                    'tel_part_code',
                    'email',
                    'date_added',
                    'operator',
                    'contact_point',
                    'extra_info',
                    'business',
                    'business_CUIT',
                ))
                ->where('status = ?', 1)
                ->order('id ASC');
        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row) {
            $CUIL = $row->CUIL;
            $CUIL1 = substr($CUIL, 0, 2);
            $CUIL2 = substr($CUIL, 2, 8);
            $CUIL3 = substr($CUIL, 10, 1);
            $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
            $tel_cell = $this->LandPhoneFormat($row->tel_cell);
            $tel_otro = $this->LandPhoneFormat($row->tel_otro);
            $tel_lab = $this->LandPhoneFormat($row->tel_lab);
            $tel_part = $this->LandPhoneFormat($row->tel_part);
            //$tel_cell_code = $this->CellPhoneAreaCodeFormat($row->tel_cell_code);
            $tel_otro_code = $this->areaCodeOut($row->tel_otro_code, $tel_otro);
            $tel_lab_code = $this->areaCodeOut($row->tel_lab_code, $tel_lab);
            $tel_part_code = $this->areaCodeOut($row->tel_part_code, $tel_part);
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setClient_type($row->client_type);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setDNI($row->DNI);
            $entry->setCUIL($CUIL);
            $entry->setTel_cell($tel_cell);
            $entry->setTel_lab($tel_lab);
            $entry->setTel_otro($tel_otro);
            $entry->setTel_part($tel_part);
            //$entry->setTel_cell_code($tel_cell_code);
            $entry->setTel_lab_code($tel_lab_code);
            $entry->setTel_otro_code($tel_otro_code);
            $entry->setTel_part_code($tel_part_code);
            $entry->setEmail($row->email);
            $entry->setActivity($row->activity);
            $entry->setDate_added(date("d/m/Y", strtotime($row->date_added)));
            $entry->setOperator($row->operator);
            $entry->setContact_point($row->contact_point);
            $entry->setExtra_info($row->extra_info);
            $entry->setBusiness($row->business);
            $entry->setBusiness_CUIT($row->business_CUIT);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function fetchAsJsonAll() {
        $resultSet = $this->getDbTable()->fetchAll(
                $this->getDbTable()->select()
                        ->order('id ASC')
        );
        $entries = array();

        $json = "";
        $json .= "{";
        $json .= "page: 1,\n";
        $json .= "total: 200,\n";
        $json .= "rows: [";
        $rc = false;

        foreach ($resultSet as $row) {
            if ($rc)
                $json .= ",";
            $json .= "{";
            $json .= "id:'" . $row->id . "',";
            $json .= "cell:['" . $row->id . "'";
            $json .= ",'" . addslashes($row->client_type) . "'";
            $json .= ",'" . addslashes($row->DNI) . "'";
            $json .= ",'" . addslashes($row->CUIL) . "'";
            $json .= ",'" . addslashes($row->tel) . "'";
            $json .= ",'" . addslashes($row->address_1) . "'";
            $json .= ",'" . addslashes($row->address_2) . "'";
            $json .= ",'" . addslashes($row->email) . "'";
            $json .= ",'" . addslashes($row->activity) . "'";
            $json .= ",'" . addslashes($row->date_added) . "'";
            $json .= ",'" . addslashes($row->operator) . "'";
            $json .= ",'" . addslashes($row->contact_point) . "'";
            $json .= ",'" . addslashes($row->extra_info) . "']";
            $json .= "}";
            $rc = true;
        }
        $json .= "]";
        $json .= "}";


        /* $json = "";
          $json .= "{\n";
          $json .= "page: 1,\n";
          $json .= "total: 20,\n";
          $json .= "rows: [";
          $rc = false;
          while ($row = mysql_fetch_array($result)) {
          if ($rc) $json .= ",";
          $json .= "\n{";
          $json .= "id:'".$row['iso']."',";
          $json .= "cell:['".$row['iso']."'";
          $json .= ",'".addslashes($row['name'])."'";
          $json .= ",'".addslashes($row['printable_name'])."'";
          $json .= ",'".addslashes($row['iso3'])."'";
          $json .= ",'".$row['numcode']."']";
          $json .= "}";
          $rc = true;
          }
          $json .= "]\n";
          $json .= "}";
          echo $json; */
        return $json;
    }

    public function delete(Gyuser_Model_User $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }

    public function DeleteClientDetails(Gyuser_Model_User $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            if ($result) {
                $addressMapper = new Gyuser_Model_AddressDataMapper();
                $addressObj = new Gyuser_Model_Address();
                $addressObj->setClient_id($obj->getId());
                $addressMapper->DeleteClientAddress($addressObj);

                $bankMapper = new Gyuser_Model_BankAccountsDataMapper();
                $bankObj = new Gyuser_Model_BankAccounts();
                $bankObj->setUser_id($obj->getId());
                $bankMapper->DeleteClientBankAccounts($bankObj);
            }
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }

    public function fetchAllClientNames() {
        $table = $this->getDbTable();
        $resultSet = $table->fetchAll(
                $table->select()
                        ->from($table, array('id', 'first_name', 'last_name'))
                        ->order('first_name ASC')
        );
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function findClientNames(Gyuser_Model_Operator $obj) {
        $table = $this->getDbTable();
        $row = $table->fetchRow(
                $table->select()
                        ->from($table, array('id', 'first_name', 'last_name'))
                        ->where('id = ?', $obj->getId())
        );
        $entry = new Gyuser_Model_User();
        if ($row) {
            $entry->setId($row->id);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
        }
        return $entry;
    }

    public function fetchDrp() {
        $table = $this->getDbTable();
        $resultSet = $table->fetchAll(
                $table->select()
                        ->from($table, array('id', 'first_name'))
                        ->order('first_name ASC')
        );
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_User();
            $entry->setId($row->id);
            $entry->setFirst_name($row->first_name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetClientCountByOperatorId(Gyuser_Model_Operator $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, 'COUNT(id) AS num');
        $select->where('operator = ?', $obj->getId());
        $row = $table->fetchRow($select);
        return $row->num;
    }

    public function CellPhoneFormat($number) {
        $numLen = strlen($number);
        if ($numLen == 8) {
            $number = '15' . $number;
        } else if ($numLen > 1) {
            $number = '1' . $number;
        }
        $newNum = '';
        $numLen = strlen($number);
        if ($numLen > 4) {
            $numArr = array();
            $subnum = '';
            for ($i = $numLen; $i >= 0; $i -= 4) {
                $pos = $i - 4;
                if ($pos >= 0) {
                    $rt = 4;
                    $subnum = substr($number, $pos, $rt);
                } else {
                    $subnum = substr($number, 0, $numLen % 4);
                }
                if ($subnum != '') {
                    $numArr[] = $subnum;
                }
            }
            $numArr = array_reverse($numArr);
            $newNum = join("-", $numArr);
        } else {
            $newNum = $number;
        }
        return $newNum;
    }

    public function LandPhoneFormat($number) {
        $numLen = strlen($number);
        $newNum = '';
        if ($numLen > 4) {
            $numArr = array();
            $subnum = '';
            for ($i = $numLen; $i >= 0; $i -= 4) {
                $pos = $i - 4;
                if ($pos >= 0) {
                    $rt = 4;
                    $subnum = substr($number, $pos, $rt);
                } else {
                    $subnum = substr($number, 0, $numLen % 4);
                }
                if ($subnum != '') {
                    $numArr[] = $subnum;
                }
            }
            $numArr = array_reverse($numArr);
            $newNum = join("-", $numArr);
        } else {
            $newNum = $number;
        }
        return $newNum;
    }

    public function CellPhoneAreaCodeFormat($code) {
        if (substr($code, 0, 3) == '+54') {
            $code = str_replace("+54", "0", $code);
        }
        return $code;
    }
    
    public function areaCodeOut($code, $tel) {
        if (trim($code) == '' && trim($tel) != '') 
            $code = '011';
        
        return $code;
    }    

    public function ClientDetailsById(Gyuser_Model_User $obj) {
        $row = $this->getDbTable()->fetchRow(
                $this->getDbTable()->select()
                        ->where('id = ?', $obj->getId())
        );
        $CUIL = $row->CUIL;
        $CUIL1 = substr($CUIL, 0, 2);
        $CUIL2 = substr($CUIL, 2, 8);
        $CUIL3 = substr($CUIL, 10, 1);
        $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
        //$tel_cell = $this->CellPhoneFormat($row->tel_cell);
        //$tel_otro = $this->CellPhoneFormat($row->tel_otro);
        $tel_cell = $this->LandPhoneFormat($row->tel_cell);
        $tel_otro = $this->LandPhoneFormat($row->tel_otro);
        $tel_lab = $this->LandPhoneFormat($row->tel_lab);
        $tel_part = $this->LandPhoneFormat($row->tel_part);
        //$tel_cell_code = $this->areaCodeOut($row->tel_cell_code);
        $tel_otro_code = $this->areaCodeOut($row->tel_otro_code, $tel_otro);
        $tel_lab_code = $this->areaCodeOut($row->tel_lab_code, $tel_lab);
        $tel_part_code = $this->areaCodeOut($row->tel_part_code, $tel_part);

        $entry = new Gyuser_Model_User();
        $entry->setId($row->id);
        $entry->setClient_type($row->client_type);
        $entry->setFirst_name($row->first_name);
        $entry->setLast_name($row->last_name);
        $entry->setDNI($row->DNI);
        $entry->setCUIL($CUIL);
        $entry->setTel_cell($tel_cell);
        $entry->setTel_lab($tel_lab);
        $entry->setTel_otro($tel_otro);
        $entry->setTel_part($tel_part);
        //$entry->setTel_cell_code($tel_cell_code);
        $entry->setTel_lab_code($tel_lab_code);
        $entry->setTel_otro_code($tel_otro_code);
        $entry->setTel_part_code($tel_part_code);
        $entry->setEmail($row->email);
        $entry->setActivity($row->activity);
        $entry->setDate_added(date("d/m/Y", strtotime($row->date_added)));
        $entry->setOperator($row->operator);
        $entry->setContact_point($row->contact_point);
        $entry->setExtra_info($row->extra_info);
        $entry->setBusiness($row->business);
        $entry->setBusiness_CUIT($row->business_CUIT);
        $entry->setStatus($row->status);
        return $entry;
    }

    public function ValidateCUIL(Gyuser_Model_User $obj) {
        $id = (int) $obj->getId();
        $CUIL = $obj->getCUIL();
        if (trim($CUIL) == '') {
            return true;
        }
        if (!$id)
            $query = "SELECT count(CUIL) as CUIL_count,id FROM clients WHERE CUIL = '$CUIL' and status = 1 ";
        else
            $query = "SELECT count(CUIL) as CUIL_count,id FROM clients WHERE CUIL = '$CUIL' and status = 1 and id != $id";

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $count = $row[0]['CUIL_count'];
        if ($count) {
            $cObj = new Gyuser_Model_Operator();
            $cId = $row[0]['id'];
            $cObj->setId($cId);
            $cObj = $this->findClientNames($cObj);
            $First_name = $cObj->getFirst_name();
            $Last_name = $cObj->getLast_name();
            $rArr = array(
                'f_name' => $First_name,
                'l_name' => $Last_name,
            );
            return $rArr;
        } else {
            return true;
        }
    }

    public function ValidateDNI(Gyuser_Model_User $obj) {
        $id = (int) $obj->getId();
        $DNI = $obj->getDNI();
        if (trim($DNI) == '') {
            return true;
        }
        if (!$id)
            $query = "SELECT count(DNI) as DNI_count,id FROM clients WHERE DNI = '$DNI' and status = 1 ";
        else
            $query = "SELECT count(DNI) as DNI_count,id FROM clients WHERE DNI = '$DNI' and status = 1 and id != $id";

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $count = $row[0]['DNI_count'];
        if ($count) {
            $cObj = new Gyuser_Model_Operator();
            $cId = $row[0]['id'];
            $cObj->setId($cId);
            $cObj = $this->findClientNames($cObj);
            $First_name = $cObj->getFirst_name();
            $Last_name = $cObj->getLast_name();
            $rArr = array(
                'f_name' => $First_name,
                'l_name' => $Last_name,
            );
            return $rArr;
        } else {
            return true;
        }
    }

    public function ValidateEmail(Gyuser_Model_User $obj) {
        $id = (int) $obj->getId();
        $email = $obj->getEmail();
        if (trim($email) == '') {
            return true;
        }
        if (!$id)
            $query = "SELECT count(email) as email_count,id FROM clients WHERE email = '$email' and status = 1 ";
        else
            $query = "SELECT count(email) as email_count,id FROM clients WHERE email = '$email' and status = 1 and id != $id";

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $count = $row[0]['email_count'];
        if ($count) {
            $cObj = new Gyuser_Model_Operator();
            $cId = $row[0]['id'];
            $cObj->setId($cId);
            $cObj = $this->findClientNames($cObj);
            $First_name = $cObj->getFirst_name();
            $Last_name = $cObj->getLast_name();
            $rArr = array(
                'f_name' => $First_name,
                'l_name' => $Last_name,
            );
            return $rArr;
        } else {
            return true;
        }
    }

    public function ValidateCUIT(Gyuser_Model_User $obj) {
        $id = (int) $obj->getId();
        $business_CUIT = $obj->getBusiness_CUIT();
        if (trim($business_CUIT) == '') {
            return true;
        }
        if (!$id)
            $query = "SELECT count(business_CUIT) as business_CUIT_count,id FROM clients WHERE business_CUIT = '$business_CUIT' and status = 1 ";
        else
            $query = "SELECT count(business_CUIT) as business_CUIT_count,id FROM clients WHERE business_CUIT = '$business_CUIT' and status = 1 and id != $id";

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $count = $row[0]['business_CUIT_count'];
        if ($count) {
            $cObj = new Gyuser_Model_Operator();
            $cId = $row[0]['id'];
            $cObj->setId($cId);
            $cObj = $this->findClientNames($cObj);
            $First_name = $cObj->getFirst_name();
            $Last_name = $cObj->getLast_name();
            $rArr = array(
                'f_name' => $First_name,
                'l_name' => $Last_name,
            );
            return $rArr;
        } else {
            return true;
        }
    }

    public function UpdateUserType(Gyuser_Model_User $obj) 
    {    
        $update = false;        
        switch($obj->getClient_type()) {
            case 1:
            case 2:
                if ($this->checkPotencialClient($obj->getId()))
                    $update = true;
                break;
            case 3:
                if ($this->checkActiveClient($obj->getId()))
                    $update = true;
                break;
            case 4:
                if ($this->checkCobranzasOp($obj->getId()))
                    $update = true;
                break;
            case 5:
                if ($this->checkPasiveClient($obj->getId()))
                    $update = true;
                break;
        }   
        if ($update) {
            $table = $this->getDbTable();
            $set = array('client_type' => $obj->getClient_type(), 'type_change' => date('Y-m-d'));
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
        }
        else 
            $result = false;
        
        return $result;        
    }

    public function findClient(Gyuser_Model_User $obj) {
        
        /*$table = $this->getDbTable();
        $row = $table->fetchRow(
                $table->select()
                      ->join(array('client_types' => 'CT'),'clients.client_type = CT.id')
                      ->where('id = ?', $obj->getId())
        );*/
        
        
        /*
         * TRY THIS
         * $select->from(array('opr' => 'operations'), array('*'));
        $select->joinLeft(array('ocvs' => 'other_caves'), 'opr.cave_id = ocvs.id', array('name as cave_name'));
         */
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query("SELECT C.*, CT.name AS client_type_name FROM clients C JOIN client_types CT on C.client_type = CT.id WHERE C.id =".$obj->getId());
        $rows = $stmt->fetchAll(); 
        if ($rows) {
            $row = $rows[0];            
            $CUIL = $row['CUIL'];
            if ($CUIL) {
                $CUIL1 = substr($CUIL, 0, 2);
                $CUIL2 = substr($CUIL, 2, 8);
                $CUIL3 = substr($CUIL, 10, 1);
                $CUIL = $CUIL1 . '-' . $CUIL2 . '-' . $CUIL3;
            }
            $tel_cell = $this->LandPhoneFormat($row['tel_cell']);
            $tel_otro = $this->LandPhoneFormat($row['tel_otro']);
            $tel_lab = $this->LandPhoneFormat($row['tel_lab']);
            $tel_part = $this->LandPhoneFormat($row['tel_part']);
            //$tel_cell_code = $this->CellPhoneAreaCodeFormat($row['tel_cell_code'];
            $tel_otro_code = $this->areaCodeOut($row['tel_otro_code, $tel_otro']);
            $tel_lab_code = $this->areaCodeOut($row['tel_lab_code, $tel_lab']);
            $tel_part_code = $this->areaCodeOut($row['tel_part_code, $tel_part']);
            
            $entry = new Gyuser_Model_User();
            $entry->setId($row['id']);
            $entry->setClient_type($row['client_type']);
            //$entry->setClient_type_name($row['client_type_name']);
            $entry->setFirst_name($row['first_name']);
            $entry->setLast_name($row['last_name']);
            $entry->setDNI($row['DNI']);
            $entry->setCUIL($CUIL);
            $entry->setTel_cell($tel_cell);
            $entry->setTel_lab($tel_lab);
            $entry->setTel_otro($tel_otro);
            $entry->setTel_part($tel_part);
            //$entry->setTel_cell_code($tel_cell_code']);
            $entry->setTel_lab_code($tel_lab_code);
            $entry->setTel_otro_code($tel_otro_code);
            $entry->setTel_part_code($tel_part_code);
            $entry->setEmail($row['email']);
            $entry->setActivity($row['activity']);
            $entry->setDate_added(date("d/m/Y", strtotime($row['date_added'])));
            $entry->setOperator($row['operator']);
            $entry->setContact_point($row['contact_point']);
            $entry->setExtra_info($row['extra_info']);
            $entry->setBusiness($row['business']);
            $entry->setBusiness_CUIT($row['business_CUIT']);
            $entry->setType_change($row['type_change']);
        }
        return $entry;
    }

    public function findContacto(Gyuser_Model_User $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('c' => 'clients'), array('id','contact_point','client_type'))
                ->joinLeft(array('cp' => 'contact_point'), 'c.contact_point = cp.id', array('title as contact_title'))
                ->joinLeft(array('ct' => 'client_types'), 'c.client_type = ct.id', array('name as type_name'))
                ->where('c.id = ?', $obj->getId());

        $row = $table->fetchRow($select);
        $entry = array();
        if ($row) {
            $entry = array(
                'client_type' => $row->client_type,
                'contact_title' => $row->contact_title,
                'type_name' => $row->type_name
            );
        }

        return $entry;
    }
    
    public function getClientByChequeId($chequeId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array('id'))
                ->joinLeft(array('operations'), 'clients.id = operations.client_id', array())
                ->joinLeft(array('cheques'), 'operations.id = cheques.operation_id', array())
                ->where('cheques.id = ?', $chequeId);
        
        $row = $table->fetchRow($select);
        if ($row)
            return $row->id;
        else
            return false;
    }
    
    public function checkPasiveClient($clientId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array('id'))
                ->joinLeft(array('operations'), 'clients.id = operations.client_id', array())
                ->where('clients.id = ?', $clientId)
                ->where('operations.state_order_id <> 3 and operations.state_order_id <> 10 and operations.state_order_id <> 99');        
        $row = $table->fetchRow($select);
        if (count($row)) //more than 0
            $pasive = false;
        else
            $pasive = true;
        return $pasive;
    }
    
    public function checkPotencialClient($clientId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array('id'))
                ->joinLeft(array('operations'), 'clients.id = operations.client_id', array())
                ->where('clients.id = ?', $clientId)
                ->where('operations.is IS NOT NULL');        
        $row = $table->fetchRow($select);
        if (count($row)) //more than 0
            $potencial = false;
        else
            $potencial = true;
        return $pasive;
    }
    
    public function checkCobranzasOp($clientId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array('id'))
                ->joinLeft(array('operations'), 'clients.id = operations.client_id', array())
                ->joinLeft(array('cheques'), 'operations.id = cheques.operation_id', array())
                ->where('clients.id = ?', $clientId)
                ->where('cheques.status = 3 and cheques.balance > 1');     
        $row = $table->fetchRow($select);
        if (count($row)) //more than 0
            $cobranzas = true;
        else
            $cobranzas = false;
        return $cobranzas;
    }
    
    public function checkActiveClient($clientId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array('id'))
                ->joinLeft(array('operations'), 'clients.id = operations.client_id', array())
                //->joinLeft(array('cheques'), 'operations.id = cheques.operation_id', array())
                ->where('clients.id = ?', $clientId)
                ->where('operations.id IS NOT NULL')
                ->where('operations.state_order_id <> 3 AND operations.state_order_id <> 10 AND operations.state_order_id <> 99'); //operations are not informe rechazado, saldada ni cancelada
                //->where('cheques.status = 1 OR cheques.status = 4 OR cheques.status = 6');     
        $row = $table->fetchRow($select);
        if (count($row)) //more than 0
            $activo = true;
        else
            $activo = false;
        return $activo;
    }
    
    public function setPasiveClient($clientId) {        
        $id = $this->getDbTable()->update(array('client_type' => 5, 'type_change' => date('Y-m-d')), array('id = ?' => $clientId));
        return $id;        
    }
    
    public function setCobranzaClient($clientId) {        
        $id = $this->getDbTable()->update(array('client_type' => 4, 'type_change' => date('Y-m-d')), array('id = ?' => $clientId));
        return $id;        
    }
    
    public function setActiveClient($clientId) {        
        $id = $this->getDbTable()->update(array('client_type' => 3, 'type_change' => date('Y-m-d')), array('id = ?' => $clientId));
        return $id;        
    }
    
    public function updatePotencialClients() {
        $db = Zend_Db_Table::getDefaultAdapter();
        $table = $db->query('UPDATE clients LEFT JOIN operations ON clients.id = operations.client_id SET client_type = 1, type_change = NOW() WHERE operations.client_id IS NULL and clients.status = 1');
        return $table;
    }
}

