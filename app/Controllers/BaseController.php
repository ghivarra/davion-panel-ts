<?php

namespace App\Controllers;

use App\Libraries\Ghivarra\DavionShield;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Libraries\Ghivarra\VueIgniter;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;
    protected $vue;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    // protected $session;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        // Preload any models, libraries, etc, here.

        // register vue
        $this->vue = new VueIgniter();

        // E.g.: $this->session = service('session');
    }

    // create role check functions on base controller
    public function checkPermission(string $moduleAlias)
    {
        $davionShield = new DavionShield();
        $accountData  = $davionShield->getAccountData();
        $checkAccess  = $davionShield->hasAccess($moduleAlias, $accountData['admin_role_id'], $accountData['is_superadmin']);
        
        if (!$checkAccess)
        {
            return false;
        }

        return $checkAccess;
    }
}
