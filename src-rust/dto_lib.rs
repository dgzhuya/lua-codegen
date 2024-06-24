use neige_lua::api::{GetApi, LuaApi, PushApi, SetApi};
use neige_lua::state::LuaState;

use crate::utils::{lua_new, set_tbl};

pub trait LuaDtoLib {
    fn dto_lib(&mut self);
}

impl LuaDtoLib for LuaState {
    fn dto_lib(&mut self) {
        self.create_table(0, 2);
        self.push_rust_fn(lua_new);
        self.set_field(-2, "new");
        self.push_rust_fn(create_field_limit);
        self.set_field(-2, "limit");
        self.push_rust_fn(set_tbl);
        self.set_field(-2, "rule");
        self.set_global("DTO");
    }
}

fn set_limit(ls: &mut dyn LuaApi) -> usize {
    if ls.is_lua_tbl(1) {
        ls.push_value(-1001001);
        ls.set_field(-2, "limit")
    }
    0
}

fn create_field_limit(ls: &mut dyn LuaApi) -> usize {
    ls.create_table(0, 3);
    if ls.is_string(1) {
        ls.push_value(1);
        ls.set_field(-2, "msg");
    }
    if ls.is_number(2) {
        ls.push_value(2);
        ls.set_field(-2, "min");
    }
    if ls.is_number(3) {
        ls.push_value(3);
        ls.set_field(-2, "max");
    }
    ls.push_rust_closure(set_limit, 1);
    1
}
