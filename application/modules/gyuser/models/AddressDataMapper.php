<?php

class Gyuser_Model_AddressDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Address');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Address $obj) {
        $data = array(
            'client_id' => $obj->getClient_id(),
            'street' => $obj->getStreet(),
            'city' => $obj->getCity(),
            'state' => $obj->getState(),
            'country' => $obj->getCountry(),
            'delivery_address' => $obj->getDelivery_address(),
            'address_type' => $obj->getAddress_type(),
            'zip_code' => $obj->getZip_code()
        );
        $id = $obj->getId();
        $client_id = $obj->getClient_id();
        if ($id === null) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
        } else {
            unset($data['client_id']);
            //unset($data['delivery_address']);
            $this->getDbTable()->update($data, array('id = ?' => $id));            
        }
        //if its default delivery address, update the rest 
        //of the address not to be default delivery addresses
        if($obj->getDelivery_address()) {
            $data = array('delivery_address' => 0);
            $id = $this->getDbTable()->update($data, array('id != ?' => $id, 'client_id = ?' => $client_id));
        }        
        return $id;
    }

    public function saveWithJson($json, $clientid) {
        $multiAddress = json_decode($json);
        $newAddressIdsArr = array();
        if ($multiAddress) {
            foreach ($multiAddress as $Address) {
                $data = array(
                    'client_id' => $clientid,
                    'city' => $Address->city,
                    'street' => $Address->street,
                    'state' => $Address->state_select,
                    'zip_code' => $Address->zip_code,
                    'address_type' => $Address->address_type,
                    'country' => 'agr',
                    'delivery_address' => $Address->delivery_address,
                );
                $id = $this->getDbTable()->insert($data);
                $newAddressIdsArr[$id] = $id;
            }
        }
        return $newAddressIdsArr;
    }

    public function find($id, Gyuser_Model_Address $obj) {
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

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'name',
        ));
        $select->where('status = ?', true);
        $select->order('name ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_Address();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetAddressByClientId(Gyuser_Model_Address $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ads' => 'addresses'), array(
            'id',
            'street',
            'city',
            'zip_code',
            'state',
            'country',
            'address_type',
            'delivery_address',
        ));
        $select->join(array('pvs' => 'provincias'), 'ads.state = pvs.id', array('name as state_name'));
        $select->where('ads.client_id = ?', $obj->getClient_id());
        $select->where('ads.status = ?', true);
        $select->order('ads.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $entry = array(
                    'id' => $row->id,
                    'street' => $row->street,
                    'city' => $row->city,
                    'zip_code' => $row->zip_code,
                    'state' => $row->state,
                    'state_name' => $row->state_name,
                    'country' => $row->country,
                    'address_type' => $row->address_type,
                    'delivery_address' => $row->delivery_address,
                );
                $entries[] = $entry;
            }
        }
        return $entries;
    }

    public function GetDeliveryAddressByClientId(Gyuser_Model_Address $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ads' => 'addresses'), array(
            'id',
            'street',
            'city',
            'zip_code',
            'state',
            'country',
            'address_type',
            'delivery_address',
        ));
        $select->join(array('pvs' => 'provincias'), 'ads.state = pvs.id', array('name as state_name'));
        $select->where('ads.client_id = ?', $obj->getClient_id());
        $select->where('ads.delivery_address = ?', true);
        $select->where('ads.status = ?', true);
        $select->order('ads.id ASC');
        $row = $table->fetchRow($select);

        $entry = array(
            'id' => $row->id,
            'street' => $row->street,
            'city' => $row->city,
            'zip_code' => $row->zip_code,
            'state' => $row->state,
            'state_name' => $row->state_name,
            'country' => $row->country,
            'address_type' => $row->address_type,
            'delivery_address' => $row->delivery_address,
        );
        return $entry;
    }

    public function EditMultiAddressByClientId(Gyuser_Model_Address $obj) 
    {
        $client_id = $obj->getClient_id();
        $multiAddress = json_decode($obj->getMulti_address_json());
        $newAddressIdsArr = array();
        foreach ($multiAddress as $Address) {
            $id = (int) $Address->id;
            $data = array(
                'id' => $id,
                'client_id' => $client_id,
                'city' => $Address->city,
                'street' => $Address->street,
                'zip_code' => $Address->zip_code,
                'state' => $Address->state_select,
                'address_type' => $Address->address_type,
                'country' => 'agr',
                'delivery_address' => $Address->delivery_address,
            );

            if (!$id) {
                unset($data['id']);
                $id = $this->getDbTable()->insert($data);
            } else {
                $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            }
            $newAddressIdsArr[$id] = $id;
        }
        return $newAddressIdsArr;
    }

    public function delete(Gyuser_Model_Address $obj) {
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

    public function DeleteClientAddress(Gyuser_Model_Address $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('client_id = ?' => $obj->getClient_id());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }

}

