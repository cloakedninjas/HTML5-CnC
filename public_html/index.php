<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

		<script type="text/javascript" src="/js/easeljs-0.4.2.min.js"></script>
		<script type="text/javascript" src="/js/test.js"></script>
	</head>
	<body>
		<canvas id="canvas" width="500" height="500" style="background: darkgreen;"></canvas>
		
		<button onclick="init();">Start</button>
		
		<button onclick="build();">Build</button>
		
		<button onclick="reset();">Stop</button>
		
		
	</body>
</html>
<?php


/*
 *
 * DO THIS LATER

// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));


require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);
$application->bootstrap()
            ->run();

*/