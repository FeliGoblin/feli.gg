---
---

function initObsIntegration() {    

    const warning = document.getElementById('warning');
    const overlayTextWrapper = document.getElementById('overlay_text_wrapper');
    const overlayText = document.getElementById('overlay_text');
    const overlayCam = document.getElementById('overlay_cam');
    const particles = document.getElementById('particles-js');

    const TRANSITION_ACTIONS = {
      Show_BG: () => {
        particles.classList.add('show_background');
      },
      Hide_BG: () => {
        particles.classList.remove('show_background');
      },

      Show_Particles: () => {
        particles.style.opacity = "1";
      },
      Hide_Particles: () => {
        particles.style.opacity = "0";
      },

      Show_Cam: () => {
        overlayTextWrapper.classList.add('text_position_top');
        overlayCam.classList.add('show_cam');
      },
      Hide_Cam: () => {
        overlayTextWrapper.classList.remove('text_position_top');
        overlayCam.classList.remove('show_cam');
      },

      Show_Text: () => {
        overlayText.style.width = "100%";
      },
      Hide_Text: () => {
        overlayText.style.width = "0";
      },

      Show_Text_Opacity: () => {
        overlayTextWrapper.style.opacity = "1";
      },
      Hide_Text_Opacity: () => {
        overlayTextWrapper.style.opacity = "0";
      },
    };

    const STATUSES = {{ site.statuses | jsonify }};
    for (const status of STATUSES) {
      if (status.name) {
        TRANSITION_ACTIONS[status.name] = () => {
          overlayText.textContent = status.text;
        };
      }
    }

    // Not in OBS: show instructions and testing buttons
    if (!window.obsstudio) {
        console.warn('obsstudio API not available (probably not running inside OBS)');
        warning.style.display = 'block';
        document.body.style.backgroundColor = "#000";

        const p_TRANSITION_ACTIONS = document.getElementById("TRANSITION_ACTIONS")
        const devPanel = document.createElement('div');
        devPanel.style.position = 'fixed';
        devPanel.style.top = '10px';
        devPanel.style.left = '10px';
        devPanel.style.zIndex = '9999';
        devPanel.style.background = 'rgba(0,0,0,0.7)';
        devPanel.style.color = '#fff';
        devPanel.style.padding = '8px';
        devPanel.style.fontSize = '12px';
        for (const key of Object.keys(TRANSITION_ACTIONS)) {
          devPanel.innerHTML += "<button data-t='" + key + "'>" + key + "</button>"
          p_TRANSITION_ACTIONS.innerHTML += "<br/>" + key
        }
        document.body.appendChild(devPanel);

        devPanel.addEventListener('click', (e) => {
            const t = e.target.dataset.t;
            if (t && TRANSITION_ACTIONS[t]) {
            TRANSITION_ACTIONS[t]();
            }
        });

        TRANSITION_ACTIONS["Show_Particles"]()
        TRANSITION_ACTIONS["Show_Text_Opacity"]()
        TRANSITION_ACTIONS["Show_Text"]()

      return;
    }
    else {
        console.log(window.obsstudio.pluginVersion);
    }


    window.addEventListener('obsTransitionChanged', function(event) {
        const transition_name = event.detail.name
        console.log('Transition:', transition_name);

        const action = TRANSITION_ACTIONS[transition_name];
        if (!action) {
            console.warn('Unknown transition:', transition_name);
            return;
        }

        action();
    })
}

document.addEventListener('DOMContentLoaded', initObsIntegration);