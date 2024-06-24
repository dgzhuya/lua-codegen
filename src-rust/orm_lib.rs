use neige_lua::api::{GetApi, LuaApi, PushApi, SetApi};
use neige_lua::state::LuaState;

use crate::utils::{lua_new, set_tbl, set_tbl_inline};

pub trait LuaOrmLib {
    fn orm_lib(&mut self);
}

impl LuaOrmLib for LuaState {
    fn orm_lib(&mut self) {
        self.create_table(0, 3);

        self.push_rust_fn(lua_new);
        self.set_field(-2, "new");
        self.push_rust_fn(set_tbl);
        self.set_field(-2, "column");
        self.push_rust_fn(column_type);
        self.set_field(-2, "cType");

        self.set_global("ORM");
    }
}

/// 设置数据库字段类型
///
/// ```lua
/// function ORM.cType(type)
///     return function(tbl)
///         tbl['dataType'] = type
///     end
/// end
/// ```
fn column_type(ls: &mut dyn LuaApi) -> usize {
    ls.push_string("dataType");
    ls.push_value(1);
    ls.push_rust_closure(set_tbl_inline, 2);
    1
}
