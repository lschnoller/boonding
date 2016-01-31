<?php

class Gyuser_Model_Notifications {

    protected $_id;
    protected $_origin_id;
    protected $_event_id;
    protected $_event_type;
    protected $_event_action;
    protected $_operator_type;
    protected $_operator_id;
    protected $_client_id;
    protected $_title;
    protected $_comment;
    protected $_extra;
    protected $_ref_date;
    protected $_due_date;
    protected $_action_date;
    protected $_status;

    public function __construct(array $options = null) {
        if (is_array($options)) {
            $this->setOptions($options);
        }
    }

    public function __set($name, $value) {
        $method = 'set' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        $this->$method($value);
    }

    public function __get($name) {
        $method = 'get' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        return $this->$method();
    }

    public function setOptions(array $options) {
        $methods = get_class_methods($this);
        foreach ($options as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (in_array($method, $methods)) {
                $this->$method($value);
            }
        }
        return $this;
    }

    public function getId() {
        return $this->id;
    }

    public function getOrigin_id() {
        return $this->origin_id;
    }

    public function getEvent_id() {
        return $this->event_id;
    }

    public function getEvent_type() {
        return $this->event_type;
    }

    public function getEvent_action() {
        return $this->event_action;
    }

    public function getOperator_type() {
        return $this->operator_type;
    }

    public function getOperator_id() {
        return $this->operator_id;
    }

    public function getClient_id() {
        return $this->client_id;
    }

    public function getTitle() {
        return $this->title;
    }

    public function getComment() {
        return $this->comment;
    }

    public function getExtra() {
        return $this->extra;
    }

    public function getRef_date() {
        return $this->ref_date;
    }

    public function getDue_date() {
        return $this->due_date;
    }

    public function getAction_date() {
        return $this->action_date;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setId($x) {
        $this->id = $x;
    }

    public function setOrigin_id($x) {
        $this->origin_id = $x;
    }

    public function setEvent_id($x) {
        $this->event_id = $x;
    }

    public function setEvent_type($x) {
        $this->event_type = $x;
    }

    public function setEvent_action($x) {
        $this->event_action = $x;
    }

    public function setOperator_type($x) {
        $this->operator_type = $x;
    }

    public function setOperator_id($x) {
        $this->operator_id = $x;
    }

    public function setClient_id($x) {
        $this->client_id = $x;
    }

    public function setTitle($x) {
        $this->title = $x;
    }

    public function setComment($x) {
        $this->comment = $x;
    }

    public function setExtra($x) {
        $this->extra = $x;
    }

    public function setRef_date($x) {
        $this->ref_date = $x;
    }

    public function setDue_date($x) {
        $this->due_date = $x;
    }

    public function setAction_date($x) {
        $this->action_date = $x;
    }

    public function setStatus($x) {
        $this->status = $x;
    }

}

