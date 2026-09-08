import Capacitor
import Network
import UIKit

final class OniromancyBridgeViewController: CAPBridgeViewController {
    private let pathMonitor = NWPathMonitor()
    private let monitorQueue = DispatchQueue(label: "com.oniromancy.network-monitor")
    private var isShowingFallback = false

    override func viewDidLoad() {
        super.viewDidLoad()

        pathMonitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                guard let self else { return }
                if path.status == .satisfied {
                    self.reloadRemoteSiteIfNeeded()
                } else {
                    self.loadOfflineFallback()
                }
            }
        }
        pathMonitor.start(queue: monitorQueue)
    }

    deinit {
        pathMonitor.cancel()
    }

    private func loadOfflineFallback() {
        guard !isShowingFallback,
              let webView,
              let fallbackURL = Bundle.main.url(
                forResource: "index",
                withExtension: "html",
                subdirectory: "public"
              ) else { return }

        isShowingFallback = true
        webView.loadFileURL(fallbackURL, allowingReadAccessTo: fallbackURL.deletingLastPathComponent())
    }

    private func reloadRemoteSiteIfNeeded() {
        guard isShowingFallback, let webView, let remoteURL = configuredServerURL() else { return }
        isShowingFallback = false
        webView.load(URLRequest(url: remoteURL))
    }

    private func configuredServerURL() -> URL? {
        guard let configURL = Bundle.main.url(forResource: "capacitor.config", withExtension: "json"),
              let data = try? Data(contentsOf: configURL),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let server = json["server"] as? [String: Any],
              let rawURL = server["url"] as? String else { return nil }
        return URL(string: rawURL)
    }
}
