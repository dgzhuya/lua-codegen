use neige_lua::{
    api::{GetApi, LuaApi, PushApi, SetApi},
    state::LuaState,
};

pub trait LuaApiLib {
    fn api_lib(&mut self);
}

impl LuaApiLib for LuaState {
    fn api_lib(&mut self) {
        self.create_table(0, 1);
        self.push_rust_fn(new);
        self.set_field(-2, "new");
        self.set_global("API")
    }
}

fn new(ls: &mut dyn LuaApi) -> usize {
    ls.create_table(0, 1);
    if ls.is_string(1) {
        ls.push_value(1);
        ls.set_field(-2, "key")
    }
    if ls.is_boolean(2) {
        ls.push_boolean(true);
        ls.set_field(-2, "noAuth")
    }
    if ls.is_boolean(3) {
        ls.push_boolean(true);
        ls.set_field(-2, "interceptor")
    }
    1
}
