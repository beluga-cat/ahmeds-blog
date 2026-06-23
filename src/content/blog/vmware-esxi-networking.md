---
title: "VMware ESXi: Networking Configuration Best Practices"
pubDate: 2026-06-20
description: "Learn how to properly configure virtual networking in VMware ESXi for optimal performance and security"
category: "Virtualization"
tags: ["vmware", "esxi", "networking", "vswitch", "security"]
author: "Ahmed"
---

Proper networking configuration in VMware ESXi is critical for performance, security, and manageability. This guide covers the essential settings every admin should know.

## Understanding vSwitches

ESXi uses two types of virtual switches:

### Standard vSwitch (vSwitch)
- Managed per host
- Simple configuration
- Good for small environments

### Distributed vSwitch (dvSwitch)
- Managed at vCenter level
- Centralized configuration
- Better for larger deployments

## Initial Configuration

### 1. Create Separate vSwitches

Segregate traffic types for security and performance:

```
vSwitch0: Management Network
vSwitch1: VM Traffic (Production)
vSwitch2: vMotion
vSwitch3: Storage (iSCSI/NFS)
```

### 2. Configure NIC Teaming

Set up NIC teaming for redundancy:

```bash
# Via ESXi CLI
esxcli network nic list
esxcli network vswitch standard uplink add --vswitch-name=vSwitch0 --uplink-name=vmnic1
```

**Recommended teaming policies:**

- **Route based on originating virtual port** (default, good for most cases)
- **Route based on IP hash** (requires EtherChannel on physical switch)
- **Route based on physical NIC load** (best for load balancing)

### 3. Enable Jumbo Frames (for iSCSI/NFS)

If using iSCSI or NFS storage, enable jumbo frames end-to-end:

```
Physical Switch: MTU 9000
ESXi vmkernel port: MTU 9000
Storage array: MTU 9000
```

```bash
esxcli network vswitch standard set --vswitch-name=vSwitch3 --mtu=9000
```

## Security Settings

### 1. Promiscuous Mode

**Set to: Reject** (default)

Prevents VMs from seeing all traffic on the vSwitch.

### 2. MAC Address Changes

**Set to: Reject** (default)

Prevents VMs from changing their MAC address.

### 3. Forged Transmits

**Set to: Reject** (default)

Prevents VMs from sending traffic with a different source MAC.

### Exception: Nested Virtualization

If running nested ESXi or NSX-T, you may need to enable these on specific port groups:

```
Promiscuous Mode: Accept
MAC Address Changes: Accept
Forged Transmits: Accept
```

## Performance Optimization

### 1. Use Multiple vmnics

Distribute traffic across multiple physical NICs:

```
Management: 2 x 1GbE (redundancy)
VM Traffic: 2 x 10GbE (performance)
vMotion: 2 x 10GbE (dedicated)
Storage: 2 x 25GbE (high throughput)
```

### 2. Enable Network I/O Control (NIOC)

Prioritize traffic types with NIOC:

```
Management: High shares
vMotion: Normal shares
VM Traffic: Normal shares
Storage: High shares (if shared)
```

### 3. Adjust TCP Offload Settings

For optimal performance, enable hardware offload:

```bash
esxcli network nic tso ipv4 set --nic-name=vmnic0 --enable=true
esxcli network nic tso ipv6 set --nic-name=vmnic0 --enable=true
```

## Monitoring and Troubleshooting

### Useful Commands

```bash
# List all vSwitches
esxcli network vswitch standard list

# Check NIC status
esxcli network nic list

# View vmkernel ports
esxcli network ip interface list

# Ping test with jumbo frames
vmkping -I vmk1 -s 8972 -d 192.168.10.10
```

### Common Issues

#### Issue: Network Disconnectivity After vMotion

**Cause**: VLAN mismatch between hosts

**Solution**: Ensure all hosts have identical VLAN configurations

#### Issue: Slow Storage Performance

**Cause**: MTU mismatch or insufficient bandwidth

**Solution**: Verify jumbo frames end-to-end and check for bottlenecks

## Conclusion

Proper ESXi networking configuration requires careful planning. Always:

1. Segregate traffic types
2. Implement redundancy with NIC teaming
3. Secure your vSwitches
4. Monitor performance regularly

Next up: Advanced dvSwitch configurations and NSX integration!
