
# You have to create livekit.yaml to run livekit-server
# Sample is as below:

port: 7880
log_level: info

rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50100

keys:
  minespeak_key: ***


# Or, you can config directly in docker-compose.yaml
# EnvVars in docker-compose.yaml is prior than livekit.yaml
# Sample is as below:

LIVEKIT_CONFIG: |
        port: 7880
        log_level: info
        rtc:
          tcp_port: 7881
          port_range_start: 50000
          port_range_end: 50100
        keys:
          ${LIVEKIT_API_KEY}: ${LIVEKIT_API_SECRET}