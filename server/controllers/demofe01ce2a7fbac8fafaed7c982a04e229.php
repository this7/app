<?php
namespace server\controllers;
class demofe01ce2a7fbac8fafaed7c982a04e229 {
    public function index() {
        return R(function ($e){extract($e);
            P($this->nihao());
            return 124;
        });
    }

    public function nihao($value = '') {
        return R(function ($e){extract($e);
            return array("__def" => 1, "ddd" => 1, "ndeq" => "23123", "nihao" => 3);
        });
    }

    public function copy1($value = '') {
        P("公司电脑");
        $to_path = '/Users/else/THIS7';
        syn_copy($to_path);
    }

    public function copy2($value = '') {
        P("家里电脑");
        $to_path = '/Users/sena/THIS7';
        syn_copy($to_path);
    }
}