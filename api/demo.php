<?php
class demo {
    public function index() {
        echo "conveyancer" . md5("conveyancer");
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