<?php

class Gyuser_Model_HolidaysDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Holidays');
        }
        return $this->_dbTable;
    }

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'holiday_date',
        ));
        $select->order('id ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entries[] = $row->holiday_date;
            /*
            $entry = new Gyuser_Model_Holidays();
            $entry->setId($row->id);
            $entry->setHoliday_date($row->holiday_date ? date("d/m/Y", strtotime($row->holiday_date)) : '');
            $entries[] = $entry;            
             */
        }
        return $entries;
    }

    public function save(Gyuser_Model_Holidays $obj) {

        $data = array(
            "holiday_date" => $obj->getHoliday_date(),
        );
        $id = $obj->getId();
        if (!$id) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function SaveWithJson(Gyuser_Model_Holidays $obj) {
        $Holiday_json = $obj->getHoliday_json();

        $Holiday_json = json_decode($Holiday_json);

        $newObj = new Gyuser_Model_Holidays();

        $this->deleteALL();

        foreach ($Holiday_json as $holiday) {
            $id = (int) $holiday->id;
            $date = $holiday->date;

            list ( $Day, $Month, $Year ) = explode('/', $date);
            $date = mktime(0, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $date);

            $newObj->setId($id);
            $newObj->setHoliday_date($date);

            $this->save($newObj);
        }
    }

    public function find($id, Gyuser_Model_Holidays $obj) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $obj->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function delete(Gyuser_Model_Holidays $obj) {


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

    public function deleteALL() {
        $table = $this->getDbTable();
        $result = $table->delete();
        return $result;
    }

    public function fetchAllJson() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'holiday_date',
        ));
        $select->order('id ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $entry = array(
                    'id' => $row->id,
                    'holiday_date' => $row->holiday_date ? date("d/m/Y", strtotime($row->holiday_date)) : '',
                );
                $entries[] = $entry;
            }
        }
        return $entries;
    }

}

