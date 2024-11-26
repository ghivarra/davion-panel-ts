<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Ghivarra\DavionShield;
use App\Models\WebsiteModel;
use Config\Services;
use CodeIgniter\HTTP\ResponseInterface;

class LoginController extends BaseController
{
    public function authenticate(): ResponseInterface
    {
        $davionShield  = new DavionShield();
        $isAuthSuccess = $davionShield->attempt();

        // session not needed anymore, unlock the session file mechanism
        session_write_close();

        // check for return
        if (!$isAuthSuccess)
        {
            return $this->response->setJSON([
                'status'  => 'error',
                'message' => 'Akun dan password yang diinput tidak sesuai',
                'data'    => [
                    'csrfToken' => csrf_token(),
                    'csrfHash'  => csrf_hash()
                ]
            ]);

        } else {

            return $this->response->setJSON([
                'status'  => 'success',
                'message' => 'Otentikasi berhasil, anda akan dialihkan ke halaman panel dalam beberapa detik'
            ]);
        }
    }

    //================================================================================================
    
    public function index(): string
    {
        $websiteModel = new WebsiteModel();

        // return and render vue
        return $this->vue->render('IndexView', [
            'title'     => 'Halaman Login',
            'website'   => $websiteModel->getAllData(),
            'csrfToken' => csrf_token(),
            'csrfHash'  => csrf_hash()
        ]);
    }

    //================================================================================================
}
