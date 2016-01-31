<?php

class Gyuser_Model_BankAccountsDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_BankAccounts');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_BankAccounts $bank) {
        if (trim($bank->getOpening_date()) == '') {
            $opening_date = null;
        } else {
            $dateArr = explode('/', $bank->getOpening_date());
            if(checkdate($dateArr[1], $dateArr[0], $dateArr[2])) {
                $stampeddate = mktime(12, 0, 0, $dateArr[1], $dateArr[0], $dateArr[2]);
                $opening_date = date("Y-m-d", $stampeddate);
            }
            elseif(checkdate($dateArr[0], '01', $dateArr[1])) { //in case they have entered only month and year format ex: 02/1993
                $stampeddate = mktime(12, 0, 0, $dateArr[0], '01', $dateArr[1]);
                $opening_date = date("Y-m-d", $stampeddate);
            }
            else
                throw Exception('The bank opening date is invalid.');
        }
        $data = array(
            "user_id" => $bank->getUser_id(),
            "bank_name" => $bank->getBank_name(),
            "account_n" => $bank->getAccount_n(),
            "branch" => $bank->getBranch(),
            "opening_date" => $opening_date,
            "zip_code" => $bank->getZip_code(),
            "location_capital" => $bank->getLocation_capital(),
        );
        if (null === ($id = $bank->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['user_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find($id, Gyuser_Model_BankAccounts $bank) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $bank->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        /* $resultSet = $this->getDbTable()->fetchAll();
          $entries   = array();
          foreach ($resultSet as $row) {
          $entry = new Gyuser_Model_BankAccounts();
          $entry->setId($row->pdl_id)
          ->setFirstName($row->pdl_first_name)
          ->setLastName($row->pdl_last_name)
          ->setEmail($row->pdl_email)
          ->setPhoneNumber($row->pdl_phone_number)
          ->setDOB($row->pdl_dob);
          $entries[] = $entry;
          }
          return $entries; */
    }

    public function GetBankDetailsByUserId(Gyuser_Model_BankAccounts $obj) {
        $resultSet = $this->getDbTable()->fetchAll(
                $this->getDbTable()->select()
                        ->where('user_id = ?', $obj->getUser_id())
                        ->where('status = ?', true)
                        ->order('id ASC')
        );
        $entries = array();
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $entry = array(
                    'id' => $row->id,
                    'bank_name' => $row->bank_name,
                    'branch' => $row->branch,
                    'account_n' => $row->account_n,
                    'opening_date' => $row->opening_date ? date("d/m/Y", strtotime($row->opening_date)) : '',
                    'zip_code' => $row->zip_code,
                    'location_capital' => $row->location_capital,
                );
                $entries[] = $entry;
            }
        }
        return $entries;
    }

    public function delete(Gyuser_Model_BankAccounts $obj) {


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

    public function DeleteClientBankAccounts(Gyuser_Model_BankAccounts $obj) {


        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('user_id = ?' => $obj->getUser_id());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }

}

