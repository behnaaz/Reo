package nl.cwi.reo.interpret;

/**
 * Enumerates all implemented semantics for Reo.
 */
public enum SemanticsType {

	/**
	 * Reference to component defined in the target language.
	 */
	REF,

	/**
	 * Constraint automata with memory.
	 */
	CAM,

	/**
	 * Constraint hypergraphs.
	 */
	CH,

	/**
	 * Predicates.
	 */
	P,

	/**
	 * Port automata.
	 */
	PA,

	/**
	 * Plain semantics (for testing purposes).
	 */
	PLAIN,

	/**
	 * Atomic components for Lykos compiler by Sung-Shik Jongmans.
	 */
	PR,

	/**
	 * Rule-based automata.
	 */
	RBA,

	/**
	 * Seepage automata.
	 */
	SA,

	/**
	 * Work automata.
	 */
	WA;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String toString() {
		switch (this) {
		case CAM:
			return "cam";
		case CH:
			return "rba"; // TODO fix this
		case P:
			return "p";
		case PA:
			return "pa";
		case PLAIN:
			return "plain";
		case PR:
			return "pr";
		case RBA:
			return "rba";
		case SA:
			return "sa";
		case WA:
			return "wa";
		default:
			throw new IllegalArgumentException();
		}
	}

}
