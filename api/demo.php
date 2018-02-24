<?php
class demo {
    public function index() {
        R(function ($e) {
            P($this->nihao());
            return 124;
        });
    }

    public function nihao($value = '') {
        R(function ($e) {
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