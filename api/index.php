<?php
/**
 * This7 Frame
 * @Author: qinuoyun
 * @Date:   2018-01-31 12:25:09
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2018-03-29 09:58:33
 */

class index {

    public function index() {
        R(function ($e) {
            $data = array(
                "name" => "张三",
                "sex"  => "男",
            );
            return [0, '测试数据', $data];
        });
    }

    public function demo() {
        weapp::demo();
    }
}