package com.lectiogo;

import android.view.View;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.UIManagerModuleListener;
import com.facebook.react.views.scroll.ReactHorizontalScrollView;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;

public class ScrollViewMagicModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private HashMap<Integer, UIManagerModuleListener> uiManagerModuleListeners;

  public ScrollViewMagicModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "ScrollViewMagic";
  }

  @Override
  public void initialize() {
    super.initialize();
    this.uiManagerModuleListeners = new HashMap<>();
  }

  @ReactMethod
  public void enableMaintainVisibleContentPosition(final int viewTag, final Promise promise) {
    final UIManagerModule uiManagerModule = this.reactContext.getNativeModule(UIManagerModule.class);
    this.reactContext.runOnUiQueueThread(new Runnable() {
      @Override
      public void run() {
        try {
          final ReactHorizontalScrollView scrollView = (ReactHorizontalScrollView)uiManagerModule.resolveView(viewTag);
          final UIManagerModuleListener uiManagerModuleListener = new UIManagerModuleListener() {
            private int minIndexForVisible = 0;
            private int prevFirstVisibleTop = 0;
            private View firstVisibleView = null;
            @Override
            public void willDispatchViewUpdates(final UIManagerModule uiManagerModule) {
              uiManagerModule.prependUIBlock(new UIBlock() {
                @Override
                public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                  ReactViewGroup mContentView = (ReactViewGroup)scrollView.getChildAt(0);
                  if (mContentView == null) return;
                  for (int ii = minIndexForVisible; ii < mContentView.getChildCount(); ++ii) {
                    View subview = mContentView.getChildAt(ii);
                    if (subview.getTop() >= scrollView.getScrollX()) {
                      prevFirstVisibleTop = subview.getLeft();
                      firstVisibleView = subview;
                      break;
                    }
                  }
                }
              });

              UIImplementation.LayoutUpdateListener layoutUpdateListener = new UIImplementation.LayoutUpdateListener() {
                @Override
                public void onLayoutUpdated(ReactShadowNode root) {
                  if (firstVisibleView == null) return;
                  int deltaX = firstVisibleView.getLeft() - prevFirstVisibleTop;
                  if (Math.abs(deltaX) > 0) {
                    scrollView.setScrollX(scrollView.getScrollX() + deltaX);
                  }
                  uiManagerModule.getUIImplementation().removeLayoutUpdateListener();
                }
              };

              uiManagerModule.getUIImplementation().setLayoutUpdateListener(layoutUpdateListener);
            }
          };
          uiManagerModule.addUIManagerListener(uiManagerModuleListener);
          int key = uiManagerModuleListeners.size() + 1;
          uiManagerModuleListeners.put(key, uiManagerModuleListener);
          promise.resolve(key);
        } catch(IllegalViewOperationException e) {
          promise.resolve(-1);
        }
      }
    });
  }

  @ReactMethod
  public void disableMaintainVisibleContentPosition(int key, Promise promise) {
    if (key >= 0) {
      final UIManagerModule uiManagerModule = this.reactContext.getNativeModule(UIManagerModule.class);
      uiManagerModule.removeUIManagerListener(uiManagerModuleListeners.remove(key));
    }
    promise.resolve(null);
  }
}