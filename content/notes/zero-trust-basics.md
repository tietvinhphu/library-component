---
title: Zero Trust Architecture — Nền tảng bảo mật cho SaaS hiện đại
categories:
  - network-security
  - cloud-security
tags:
  - zero-trust
  - identity
  - microsegmentation
date: "2026-06-15"
description: Nguyên tắc Zero Trust và cách triển khai cho hệ thống cloud-native. Phân biệt Zero Trust với perimeter-based security truyền thống.
source: https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/
---

## Tại sao perimeter-based security không còn đủ

Mô hình bảo mật truyền thống dựa trên **perimeter** (vành đai) — tưởng tượng có một "bức tường" bao quanh mạng nội bộ. Bên trong được tin tưởng, bên ngoài thì không. Khi mọi thứ chạy trên cloud, mô hình này sụp đổ:

- Nhân viên làm việc từ nhà, quán cà phê, khách sạn
- Dữ liệu nằm trên AWS, GCP, Azure
- Microservices giao tiếp cross-network
- API endpoint trở thành attack surface

```bash
# Mô hình cũ: perimeter = wall
[ Internet ] ---X FIREWALL X--- [ Trusted Internal Network ]

# Mô hình mới: zero = trust nothing by default
[ User ] --auth--> [ Resource ]
     |                |
     v                v
  Identity       Micro-segmented service
```

## Ba nguyên tắc cốt lõi

### 1. Never trust, always verify

Mọi request đều phải xác thực, bất kể nguồn gốc network. Không có "internal traffic" được tin tưởng mặc định.

```
# Thay vì IP-based allowlist
ALLOW from 10.0.0.0/8

# Phải verify identity + context
- User authenticated? (MFA enforced)
- Device compliant? (MDM enrolled)
- Request context valid? (time, location, behavior)
```

### 2. Least privilege access

Mỗi user/service chỉ có quyền tối thiểu cần thiết cho task cụ thể. Không có quyền truy cập "admin" nếu không cần.

```json
// IAM policy theo nguyên tắc least privilege
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::project-data/prod/reports/*",
    "Condition": {
      "IpAddress": {
        "aws:SourceIp": "10.0.0.0/8"
      },
      "Bool": {
        "aws:MultiFactorAuthPresent": "true"
      }
    }
  }]
}
```

### 3. Assume breach

Thiết kế hệ thống như thể kẻ tấn công đã ở bên trong. Xây dựng detection, logging, và isolation sẵn sàng.

## Triển khai Zero Trust cho SaaS

### Identity Provider (IdP) là trung tâm

Thay vì quản lý auth riêng, dùng IdP tập trung:

| Component | Công nghệ phổ biến |
|---|---|
| IdP | Okta, Auth0, Azure AD, Google Workspace |
| MFA | TOTP, hardware key (YubiKey), passkey |
| Directory | LDAP, SCIM sync |
| Single Sign-On | SAML 2.0, OIDC |

### Microsegmentation

Chia nhỏ network thành các zone riêng biệt, mỗi zone có policy riêng:

```
┌─────────────────────────────────────────┐
│            Zero Trust Network            │
├─────────┬──────────┬──────────┬─────────┤
│ Web Tier│ API Tier │ Data Tier│  Admin  │
│ :80,443 │  :8080   │ :5432    │  :22    │
├─────────┼──────────┼──────────┼─────────┤
│ Public  │ Auth     │ Private  │ Bastion │
│ anywhere│ mTLS     │ + RBAC    │ + JIT   │
└─────────┴──────────┴──────────┴─────────┘
```

### Service-to-service authentication

Dùng mTLS hoặc SPIFFE/SPIRE để xác thực service đang giao tiếp với nhau:

```bash
# SPIFFE workload attestation
export SPIFFE_ENDPOINT_SOCKET=unix:///run/spire/sockets/agent.sock

# Service mesh: Envoy proxy handles mTLS transparently
# Hãy cân nhắc Istio, Linkerd, Consul Connect
```

## Checklist triển khai

- [ ] **Identity**: SSO + MFA everywhere, no exceptions
- [ ] **Device**: MDM/EDM enrolled, health check on every access
- [ ] **Network**: No implicit allow, all traffic encrypted (TLS 1.3 minimum)
- [ ] **Application**: RBAC + ABAC hybrid, audit log for all access
- [ ] **Data**: Encryption at rest + in transit, data classification
- [ ] **Monitoring**: SIEM, UEBA, anomaly detection
- [ ] **Incident**: Runbook + automated response (SOAR if budget allows)

## Công cụ & Framework tham khảo

- **NIST SP 800-207**: Zero Trust Architecture — tài liệu chuẩn của chính phủ Mỹ
- **CISA Zero Trust Maturity Model**: 5 pillars (Identity, Device, Network, Application, Data)
- **BeyondCorp** (Google): Paper gốc giới thiệu zero trust trong production

## Sai lầm thường gặp

| Sai lầm | Hậu quả |
|---|---|
| Chỉ triển khai IdP, bỏ qua device trust | Compromised personal device = full access |
| Zero trust = "phủ nhận tất cả" | Developer productivity dies |
| Một lần verify là đủ | Token stolen = persistent access |
| Legacy app không thể zero trust | Nếu không refactor, thì isolate + monitor kỹ |

## Kết luận

Zero Trust không phải sản phẩm để mua mà là **kiến trúc để xây dựng**. Bắt đầu từ identity (đây là attack vector lớn nhất), sau đó mở rộng dần. Không cần "big bang migration" — triển khai incremental, measure improvement.
