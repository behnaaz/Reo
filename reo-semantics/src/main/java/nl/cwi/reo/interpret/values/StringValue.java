package nl.cwi.reo.interpret.values;

/**
 * Interpretation of string value.
 */
public final class StringValue implements Value {

	/**
	 * Value.
	 */
	private String x; 
	
	/**
	 * Constructs a new integer value.
	 * @param x		value
	 */
	public StringValue(String x) {
		this.x = x;
	}

	public static StringValue concat(StringValue a, StringValue b) {
		return new StringValue(a.x + b.x);
	}

}
