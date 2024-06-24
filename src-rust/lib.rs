mod api_lib;
mod dto_lib;
mod orm_lib;
mod utils;

use api_lib::LuaApiLib;
use dto_lib::LuaDtoLib;
use gloo_utils::format::JsValueSerdeExt;
use neige_lua::{
    api::{CallApi, LuaApi, PushApi},
    state::LuaState,
    LuaValue,
};
use orm_lib::LuaOrmLib;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen(module = "@/libs")]
extern "C" {
    pub fn printToNode(name: &JsValue);
    pub fn renderNestCode(config: &JsValue, dto: &JsValue, entity: &JsValue, apiService: &JsValue);
    pub fn renderVueCode(config: &JsValue, route: &JsValue, fields: &JsValue, apiService: &JsValue);
}

/// 运行lua代码
#[wasm_bindgen]
pub fn run(data: &[u8], file_name: &str) {
    let mut state = LuaState::new();
    state.aux_lib();
    state.register("logger", logger);
    state.register("NestRender", render_nest);
    state.register("VueRender", render_vue);
    state.register("FieldNew", new_field);
    state.orm_lib();
    state.api_lib();
    state.dto_lib();
    state.load(data.to_vec(), file_name, "bt");
    state.call(0, 0)
}

/// 创建field
///
/// ```lua
/// function newField(key, type, comment)
///     return { key, type, comment }
/// end
/// ```
fn new_field(ls: &mut dyn LuaApi) -> usize {
    let cur_top = ls.get_top();
    ls.create_table(3, 0);
    for i in 1..=cur_top {
        ls.push_value(i);
        ls.set_i(-2, i as i64)
    }
    1
}

fn render_nest(ls: &mut dyn LuaApi) -> usize {
    let conig = if ls.is_lua_tbl(1) {
        let val = ls.to_lua_tbl(1).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
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
    renderNestCode(&conig, &dto, &entity, &api_service);
    0
}

fn render_vue(ls: &mut dyn LuaApi) -> usize {
    let conig = if ls.is_lua_tbl(1) {
        let val = ls.to_lua_tbl(1).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    let route = if ls.is_lua_tbl(2) {
        let val = ls.to_lua_tbl(2).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    let fields = if ls.is_lua_tbl(3) {
        let val = ls.to_lua_tbl(3).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    let api = if ls.is_lua_tbl(4) {
        let val = ls.to_lua_tbl(4).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    renderVueCode(&conig, &route, &fields, &api);
    0
}

fn logger(ls: &mut dyn LuaApi) -> usize {
    for i in 1..=ls.get_top() {
        if ls.is_lua_tbl(i) {
            let val = ls.to_lua_tbl(i).unwrap();
            let tbl = JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null());
            printToNode(&tbl)
        } else if ls.is_string(i) {
            printToNode(&JsValue::from_str(&ls.to_string(i)));
        } else if ls.is_boolean(i) {
            printToNode(&JsValue::from_bool(ls.to_boolean(i)))
        }
    }
    0
}
