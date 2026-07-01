#[tauri::command]
fn hide_window(window: tauri::WebviewWindow) {
    let _ = window.hide();
}

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_positioner::{Position, WindowExt};

fn show_window<R: Runtime>(app: &tauri::AppHandle<R>) {
    let window = app.get_webview_window("main").unwrap();
    eprintln!("show_window: moving to BottomCenter");
    let r = window.move_window(Position::BottomCenter);
    eprintln!("show_window: move_window result: {:?}", r);

    if let (Ok(pos), Ok(Some(monitor))) = (window.outer_position(), window.current_monitor()) {
        let scale = monitor.scale_factor();
        let dock_clearance = (20.0 * scale) as i32;
        eprintln!("show_window: nudging up {}px physical", dock_clearance);
        let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: pos.x,
            y: pos.y - dock_clearance,
        }));
    }
    let _ = window.set_shadow(false);

    #[cfg(target_os = "macos")]
    {
        eprintln!("show_window: setting activation policy Regular");
        let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
    }

    eprintln!("show_window: calling window.show()");
    let r = window.show();
    eprintln!("show_window: show result: {:?}", r);
    let r = window.set_focus();
    eprintln!("show_window: set_focus result: {:?}", r);

    #[cfg(target_os = "macos")]
    unsafe {
        use objc::{class, msg_send, sel, sel_impl};
        let ns_app: *mut objc::runtime::Object = msg_send![class!(NSApplication), sharedApplication];
        let _: () = msg_send![ns_app, activateIgnoringOtherApps: true];
    }
}

fn toggle_window<R: Runtime>(app: &tauri::AppHandle<R>) {
    let window = app.get_webview_window("main").unwrap();
    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
        #[cfg(target_os = "macos")]
        let _ = app.set_activation_policy(tauri::ActivationPolicy::Accessory);
    } else {
        show_window(app);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![hide_window])
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let window = app.get_webview_window("main").unwrap();
            let _ = window.show();
            let _ = window.set_focus();
        }))
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let quit = MenuItem::with_id(app, "quit", "Quit catch-later", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit])?;

            TrayIconBuilder::new()
                .menu(&menu)
                .menu_on_left_click(false)
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| {
                    tauri_plugin_positioner::on_tray_event(tray.app_handle(), &event);
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_window(tray.app_handle());
                    }
                })
                .on_menu_event(|app, event| {
                    if event.id == "quit" {
                        app.exit(0);
                    }
                })
                .build(app)?;

            let app_handle = app.handle().clone();

            #[cfg(target_os = "macos")]
            let shortcut = Shortcut::new(Some(Modifiers::SUPER | Modifiers::SHIFT), Code::KeyM);
            #[cfg(not(target_os = "macos"))]
            let shortcut = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyM);

            let reg_result = app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
                eprintln!("shortcut fired: {:?}", event.state());
                if event.state() == ShortcutState::Pressed {
                    eprintln!("calling toggle_window");
                    toggle_window(&app_handle);
                }
            });
            eprintln!("shortcut registration result: {:?}", reg_result);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
