import { useEffect, useState } from "react";

import Modal from "@/shared/system/Modal";
import Button from "@/shared/system/Button";

import { Hero } from "../features/landing/components";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";

import AuthPanel from "../features/landing/components/AuthPanel";
import {
  AUTH_VIEWS,
  AUTH_CONFIG,
} from "../features/landing/components/authConstants";

const DESKTOP_BREAKPOINT = "(min-width: 1024px)";

export default function HomePage() {
  const [authView, setAuthView] = useState(AUTH_VIEWS.LOGIN);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const currentAuth = AUTH_CONFIG[authView];

  // Close mobile modal when crossing into desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);

    const handleChange = (event) => {
      if (event.matches) {
        setIsAuthModalOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const openAuth = (view) => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const navigateAuth = (view) => {
    setAuthView(view);
  };

  return (
    <div className="min-h-screen w-full lg:flex">
      {/* =====================================================
          LEFT PANEL
      ====================================================== */}
      <div
        className="
          relative
          min-h-screen
          overflow-hidden
          flex
          flex-col
          lg:w-[55%]
          lg:shrink-0
          border-r
          border-gray-200
          dark:border-gray-800
        "
      >
        {/* Dotted background */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            opacity-50
            dark:opacity-25
            bg-[radial-gradient(circle,#9ca3af_1.5px,transparent_1.5px)]
            bg-[size:24px_24px]
          "
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <Hero />

          {/* Mobile auth buttons */}
          <div className="mt-auto flex gap-3 px-6 pb-8 pt-6 lg:hidden">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => openAuth(AUTH_VIEWS.LOGIN)}
            >
              Login
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openAuth(AUTH_VIEWS.SIGNUP)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP AUTH
      ====================================================== */}
      <div
        className="
          hidden
          min-h-screen
          flex-1
          items-center
          justify-center
          px-5
          py-8
          lg:flex
        "
      >
        <div className="w-full max-w-md">
          <AuthLayout
            title={currentAuth.title}
            subtitle={
              <>
                {authView === AUTH_VIEWS.LOGIN && (
                  <>
                    New to FinPal?{" "}
                    <button
                      type="button"
                      onClick={() => navigateAuth(AUTH_VIEWS.SIGNUP)}
                      className="text-primary-500 font-black hover:underline underline-offset-4"
                    >
                      Create account
                    </button>
                  </>
                )}

                {authView === AUTH_VIEWS.SIGNUP && (
                  <>
                    Already a member?{" "}
                    <button
                      type="button"
                      onClick={() => navigateAuth(AUTH_VIEWS.LOGIN)}
                      className="text-primary-500 font-black hover:underline underline-offset-4"
                    >
                      Sign in
                    </button>
                  </>
                )}

                {authView === AUTH_VIEWS.FORGOT_PASSWORD && (
                  <>
                    Remembered it?{" "}
                    <button
                      type="button"
                      onClick={() => navigateAuth(AUTH_VIEWS.LOGIN)}
                      className="text-primary-500 font-black hover:underline underline-offset-4"
                    >
                      Back to sign in
                    </button>
                  </>
                )}
              </>
            }
          >
            <AuthPanel
              view={authView}
              onNavigate={navigateAuth}
              mode="desktop"
            />
          </AuthLayout>
        </div>
      </div>

      {/* =====================================================
          MOBILE AUTH MODAL
      ====================================================== */}
      {isAuthModalOpen && (
        <Modal onClose={() => setIsAuthModalOpen(false)}>
          <Modal.Header>{currentAuth.title}</Modal.Header>

          <Modal.Body>
            <div className="w-full max-w-md">
              <AuthPanel
                view={authView}
                onNavigate={navigateAuth}
                mode="modal"
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
