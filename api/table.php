<?php
/**
 * this7 PHP Framework
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright 2016-2018 Yan TianZeng<qinuoyun@qq.com>
 * @license   http://www.opensource.org/licenses/mit-license.php MIT
 * @link      http://www.ub-7.com
 */
class table {
    public function index() {
        echo "安装方法：composer create-project this7/app blog --prefer-dist";
    }

    /**
     * 获取列表
     * @Author   Sean       Yan
     * @DateTime 2018-06-21
     * @return   [type]     [description]
     */
    public function get_list() {
        $table = sql::getAllTableInfo();
        $lists = [];
        $i     = 0;
        foreach ($table['table'] as $key => $value) {
            $lists[$i]['value'] = $value['tablename'];
            $lists[$i]['label'] = $value['tablename'];
            $i++;
        }
        ret(0, '成功', $lists);
    }

    /**
     * 获取字段
     * @Author   Sean       Yan
     * @DateTime 2018-06-22
     * @return   [type]     [description]
     */
    public function get_field() {
        $table = str_replace(C('sql', 'prefix'), "", $_POST['table']);
        $table = sql::table($table);
        $field = $table->getFieldInfo();
        $lists = [];
        $i     = 0;
        foreach ($field as $key => $value) {
            $lists[$i]['value'] = $value['field'];
            $lists[$i]['label'] = $value['field'] . "(" . $value['explain'] . ")";
            $i++;
        }
        ret(0, '成功', $lists);
    }
}