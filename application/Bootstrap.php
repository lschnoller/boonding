<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {
    
    protected function _initTimeZone() {        
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        //date_default_timezone_set('Europe/London'); 
        /*
         $config = array(); 
        $config['host'] = '127.0.0.1';
        $config['dbname'] = 'GY';
        $config['username'] = 'GY';
        $config['password'] = '@dm1n123';
        $config['charset'] = 'utf8';
        $config['timezone'] = 'Europe/London';
        $config['adapterNamespace'] = 'HOA_Helper_CustomAdapter';

        $db = Zend_Db::factory('PDO_MYSQL', $config);
        Zend_Db_Table::setDefaultAdapter($db);         
         */
    }
    
    protected function _initAutoload() {
        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->registerNamespace('Gyuser_');
        $autoloader->registerNamespace('CRM_');
        $moduleLoader = new Zend_Application_Module_Autoloader(array('namespace' => 'Gyuser_', 'basePath' => APPLICATION_PATH . '/modules/gyuser'));
        return $moduleLoader;
    }

    /* protected function _initRouter()
      {
      $frontController = Zend_Controller_Front::getInstance();
      $router = $frontController->getRouter();

      $reserve = new Zend_Controller_Router_Route('index/',
      array('module'     => 'gyuser',
      'controller' => 'index',
      'action'=> 'index'));

      $router->addRoute('index', $reserve);
      return $router;
      } */

    protected function _initRoutes() {
        $this->bootstrap('frontController');

        $router = $this->frontController->getRouter();

        // Admin context route
        $route = new Zend_Controller_Router_Route(
                        ':controller/:action/:param1/:param2/:param3',
                        array(
                            'param1' => 0,
                            'param2' => 0,
                            'param3' => 0,
                            'action' => 'index',
                            'controller' => 'index',
                            'module' => 'gyuser',
                            'isAdmin' => true
                        )
        );

        $router->addRoute('admin', $route);

        $route = new Zend_Controller_Router_Route(
                        ':controller/:action/:param1/:param2/:param3',
                        array(
                            'param1' => 0,
                            'param2' => 0,
                            'param3' => 0,
                            'action' => 'dashboard',
                            'controller' => 'index',
                            'module' => 'gyuser',
                            'isAdmin' => true
                        ),
                        array(
                            'param1' => '\d+'
                        )
        );

        $router->addRoute('admin', $route);
    }

    protected function _initDoctype() {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->doctype('XHTML1_STRICT');
        $view->headTitle('El Financiero');

        /* $view->headLink()->appendStylesheet('/css/text.css','screen');
          $view->headLink()->appendStylesheet('/css/cssmenuhorizontal.css','screen');
          $view->headLink()->appendStylesheet('/theme/custom-theme-white/jquery.ui.all.css');
          $view->headLink(array('rel' => 'SHORTCUT ICON',
          'href' => '/images/favlogo.png'),
          'PREPEND'); */
        $view->headLink()->appendStylesheet('/js/jquery/themes/cupertino/jquery.ui.all.css', 'screen');

        $view->headLink()->appendStylesheet('/css/gyuser.css', 'screen');
        $view->headLink()->appendStylesheet('/css/crm.css', 'screen');

        $view->headScript()->appendFile('/js/jquery/js/jquery-1.5.1.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.core.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.widget.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.button.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.position.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.mouse.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.draggable.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.droppable.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.resizable.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.tabs.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/minified/jquery.ui.datepicker.min.js');
        $view->headScript()->appendFile('/js/jquery/ui/i18n/jquery.ui.datepicker-es.js');
        $view->headScript()->appendFile('/js/jquery/ui/jquery.ui.dialog.js');
        $view->headScript()->appendFile('/js/gymain.js');
        $view->headScript()->appendFile('/js/crm.js');

        //$front_controller = Zend_Controller_Front::getInstance();
        //$front_controller->setDefaultModule("gyuser");	  
        //$view->addHelperPath('Zend/Helper/', 'Zend_Helper');
        $view->addHelperPath('HOA/Helper/', 'HOA_Helper');
    }

}

