AM_CFLAGS = -W -Wall -Wextra -Wshadow -Wpointer-arith -Wmissing-prototypes -Wcast-align \
		${egl_CFLAGS} ${glesv2_CFLAGS} \
		${x11_CFLAGS}

LDADD = \
	${egl_LIBS} ${glesv2_LIBS} \
	${x11_LIBS} -lm

if HAVE_LIBPNG
LDADD += ${libpng_LIBS}
endif

if ENABLE_WL
AM_CFLAGS += ${wayland_client_CFLAGS} ${wayland_egl_CFLAGS}
LDADD += ${wayland_client_LIBS} ${wayland_egl_LIBS}
endif

if ENABLE_KMS
AM_CFLAGS += ${drm_CFLAGS} ${gbm_CFLAGS}
LDADD += ${drm_LIBS} ${gbm_LIBS}
endif

if ENABLE_SDL2
AM_CFLAGS += ${sdl2_CFLAGS}
LDADD += ${sdl2_LIBS}
endif

GEN_SHADER_IDS = $(top_srcdir)/scripts/gen-shader-ids
DL_SHADER = $(top_srcdir)/scripts/dl-shader
FRAG2INC = $(top_srcdir)/scripts/frag2inc
INC2C = $(top_srcdir)/scripts/inc2c
SHADER_LIST_CHECK = $(top_srcdir)/scripts/chk-shader-list
SHADER_LIST = $(top_srcdir)/$(shader_list)
SHADER_IDS = $(shell $(GEN_SHADER_IDS) $(SHADER_LIST) )
SHADER_FILES = $(addsuffix .frag,$(SHADER_IDS))
SHADER_CFILES = $(addsuffix .inc,$(SHADER_IDS))

$(SHADER_LIST): shader-list-check

.PHONY: shader-list-check
shader-list-check:
	$(SHADER_LIST_CHECK) $(SHADER_LIST)

.SECONDARY: $(SHADER_FILES)

%.inc: %.frag $(srcdir)/glslsandbox-shaders.h
if ENABLE_SHADER_VALIDATION
	$(GLSLANGVALIDATOR) $<
endif
	$(FRAG2INC) $(SHADER_LIST) $< > $@.tmp
	mv -f $@.tmp $@

%.frag:
	$(DL_SHADER) $(@:.frag=) > $@.tmp
	mv -f $@.tmp $@

glslsandbox-shaders.c: $(SHADER_LIST) $(SHADER_CFILES)
	$(INC2C) $(SHADER_CFILES) > $(srcdir)/glslsandbox-shaders.c.tmp
	mv -f $(srcdir)/glslsandbox-shaders.c.tmp $(srcdir)/glslsandbox-shaders.c

bin_PROGRAMS = glslsandbox-player

BUILT_SOURCES = glslsandbox-shaders.c

nodist_glslsandbox_player_SOURCES = glslsandbox-shaders.c

glslsandbox_player_SOURCES = \
  glslsandbox-player.c glslsandbox-player.h \
  egl_helper.c egl_helper.h \
  gles_helper.c gles_helper.h \
  glslsandbox-shaders.h \
  native_gfx.h

if HAVE_LIBPNG
glslsandbox_player_SOURCES += pngio.c pngio.h
endif

if ENABLE_X11
glslsandbox_player_SOURCES += native_gfx_x11.c
endif

if ENABLE_VIVFB
glslsandbox_player_SOURCES += native_gfx_vivfb.c
endif

if ENABLE_RPI
glslsandbox_player_SOURCES += native_gfx_rpi.c
endif

if ENABLE_WL
.SECONDEXPANSION:
define protostability
$(if $(findstring unstable,$1),unstable,stable)
endef
define protoname
$(shell echo $1 | $(SED) 's/\([a-z\-]\+\)-[a-z]\+-v[0-9]\+/\1/')
endef

%-client-protocol.h : $(WAYLAND_PROTOCOLS_DATADIR)/$$(call protostability,$$*)/$$(call protoname,$$*)/$$*.xml
	$(wayland_scanner) client-header < $< > $@
%-protocol.c : $(WAYLAND_PROTOCOLS_DATADIR)/$$(call protostability,$$*)/$$(call protoname,$$*)/$$*.xml
	$(wayland_scanner) private-code < $< > $@

glslsandbox_player_SOURCES += native_gfx_wl.c
if ENABLE_WL_XDG
BUILT_SOURCES += xdg-shell-protocol.c xdg-shell-client-protocol.h
nodist_glslsandbox_player_SOURCES += xdg-shell-protocol.c xdg-shell-client-protocol.h
endif
if ENABLE_WL_IVI
glslsandbox_player_SOURCES += ivi-application-protocol.c
endif
endif

if ENABLE_KMS
glslsandbox_player_SOURCES += native_gfx_kms.c
endif

if ENABLE_WGL
glslsandbox_player_SOURCES += native_gfx_wgl.c
endif

if ENABLE_TISGX
glslsandbox_player_SOURCES += native_gfx_tisgx.c
endif

if ENABLE_MALI
glslsandbox_player_SOURCES += native_gfx_mali.c
endif
