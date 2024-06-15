mod nestjs_lib;
mod vuejs_lib;

use gloo_utils::format::JsValueSerdeExt;
use neige_lua::{
    api::{CallApi, LuaApi, PushApi},
    state::LuaState,
    LuaValue,
};
use nestjs_lib::LuaNestLib;
use vuejs_lib::LuaVueLib;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen(module = "@/libs")]
extern "C" {
    pub fn printToNode(name: &JsValue);
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

/// 运行lua代码
#[wasm_bindgen]
pub fn run(data: &[u8], file_name: &str) {
    let mut state = LuaState::new();
    state.aux_lib();
    state.register("logger", logger);
    state.nestjs_lib();
    state.vuejs_lib();
    state.load(data.to_vec(), file_name, "bt");
    state.call(0, 0)
}
