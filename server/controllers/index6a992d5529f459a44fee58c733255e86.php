<?php
namespace server\controllers;
/**
 * This7 Frame
 * @Author: qinuoyun
 * @Date:   2018-01-31 12:25:09
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2018-03-07 11:26:34
 */

class index6a992d5529f459a44fee58c733255e86 {

    public function index() {
        return R(function ($e){extract($e);
            $data = array(
                "name" => "张三",
                "sex"  => "男",
            );
            return [0, '测试数据', $data];
        });
    }
}