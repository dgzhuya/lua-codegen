use neige_lua::api::LuaApi;

pub(crate) fn lua_new(ls: &mut dyn LuaApi) -> usize {
    let cur_top = ls.get_top();
    ls.create_table(0, cur_top as usize + 2);
    if ls.is_lua_tbl(1) {
        let tp = ls.get_i(1, 1);
        if ls.tp_name(tp) == "string" {
            ls.set_field(-2, "key")
        }
        let tp = ls.get_i(1, 2);
        if ls.tp_name(tp) == "string" {
            ls.set_field(-2, "type")
        }
        let tp = ls.get_i(1, 3);
        if ls.tp_name(tp) == "string" {
            ls.set_field(-2, "comment")
        }
    }

    for i in 2..=cur_top {
        if ls.is_rust_fn(i) {
            ls.push_value(i);
            ls.push_value(-2);
            ls.call(1, 0);
        }
    }
    1
}

pub(crate) fn set_tbl_inline(ls: &mut dyn LuaApi) -> usize {
    if ls.is_lua_tbl(-1) {
        ls.push_value(-1001001);
        ls.push_value(-1001002);
        ls.set_table(-3)
    }
    0
}

/// 设置table值
///
/// ```lua
/// function SetTabl(key, value)
///     return function(tbl)
///         tbl[key] = value
///     end    
/// end
/// ```
pub(crate) fn set_tbl(ls: &mut dyn LuaApi) -> usize {
    ls.push_rust_closure(set_tbl_inline, 2);
    1
}
