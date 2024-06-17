use gloo_utils::format::JsValueSerdeExt;
use neige_lua::api::{GetApi, LuaApi, PushApi, SetApi};
use neige_lua::state::LuaState;
use neige_lua::LuaValue;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen(module = "@/libs/nest-lib")]
extern "C" {
    pub fn genApiCode(name: &str, dto: &JsValue, entity: &JsValue, apiService: &JsValue);
}

pub trait LuaNestLib {
    fn nestjs_lib(&mut self);
}

impl LuaNestLib for LuaState {
    fn nestjs_lib(&mut self) {
        self.create_table(0, 1);
        self.push_rust_fn(gen_api_code);
        self.set_field(-2, "genApiCode");

        self.push_rust_fn(crete_field);
        self.set_field(-2, "creteDtoField");
        self.push_rust_fn(create_field_limit);
        self.set_field(-2, "createLimitRule");
        self.push_rust_fn(create_field_simple);
        self.set_field(-2, "createSimpleRule");

        self.push_rust_fn(crete_field);
        self.set_field(-2, "creteEntityField");
        self.push_rust_fn(create_field_simple);
        self.set_field(-2, "createSimpleColumn");
        self.push_rust_fn(create_column_type);
        self.set_field(-2, "creteColumnType");

        self.push_rust_fn(gen_api_service_field);
        self.set_field(-2, "createApiService");
        self.set_global("NestJs");
    }
}

fn gen_api_service_field(ls: &mut dyn LuaApi) -> usize {
    ls.create_table(0, 1);
    if ls.is_string(1) {
        ls.push_value(1);
        ls.set_field(-2, "key")
    }
    if ls.is_boolean(2) {
        ls.push_boolean(true);
        ls.set_field(-2, "interceptor")
    }
    1
}

fn gen_api_code(ls: &mut dyn LuaApi) -> usize {
    let name = ls.to_string(1);
    let dto = if ls.is_lua_tbl(2) {
        let val = ls.to_lua_tbl(2).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    let entity = if ls.is_lua_tbl(3) {
        let val = ls.to_lua_tbl(3).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    let api_service = if ls.is_lua_tbl(4) {
        let val = ls.to_lua_tbl(4).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    genApiCode(&name, &dto, &entity, &api_service);
    0
}

fn set_tbl_limit(ls: &mut dyn LuaApi) -> usize {
    if ls.is_lua_tbl(-1) {
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
    ls.push_rust_closure(set_tbl_limit, 1);
    1
}

fn set_tbl_simple(ls: &mut dyn LuaApi) -> usize {
    if ls.is_lua_tbl(-1) {
        ls.push_value(-1001001);
        ls.push_value(-1001002);
        ls.set_table(-3)
    }
    0
}

fn create_column_type(ls: &mut dyn LuaApi) -> usize {
    ls.push_string("dataType");
    ls.push_value(1);
    ls.push_rust_closure(set_tbl_simple, 2);
    1
}

fn create_field_simple(ls: &mut dyn LuaApi) -> usize {
    ls.push_rust_closure(set_tbl_simple, 2);
    1
}

fn crete_field(ls: &mut dyn LuaApi) -> usize {
    let cur_top = ls.get_top();
    ls.create_table(0, cur_top as usize);
    if ls.is_string(1) {
        ls.push_value(1);
        ls.set_field(-2, "key")
    }
    if ls.is_string(2) {
        ls.push_value(2);
        ls.set_field(-2, "type")
    }
    for i in 3..=cur_top {
        if !ls.is_nil(i) && ls.is_rust_fn(i) {
            ls.push_value(i);
            ls.push_value(-2);
            ls.call(1, 0);
        }
    }
    1
}
